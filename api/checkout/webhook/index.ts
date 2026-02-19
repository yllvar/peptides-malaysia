import { prisma } from '../../_db.js';

export const config = {
    runtime: 'nodejs',
};



export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        // ToyyibPay sends 'refno' as the external reference (orderId), 'status' as the status code.
        // We fallback to checking both potential parameter names to be robust.
        const statusId = formData.get('status_id')?.toString() || formData.get('status')?.toString();
        const orderId = formData.get('order_id')?.toString() || formData.get('refno')?.toString();
        const billCode = formData.get('billcode')?.toString();
        const transactionId = formData.get('transaction_id')?.toString();

        if (!orderId || !statusId || !billCode) {
            return Response.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // --- SECURITY: Verify the order exists and the billCode matches ---
        const payment = await prisma.orderPayment.findUnique({
            where: { orderId },
        });

        if (!payment || payment.gatewayRef !== billCode) {
            console.error(`Webhook rejected: billCode mismatch for order ${orderId}. Expected ${payment?.gatewayRef}, got ${billCode}`);
            return Response.json({ error: 'Invalid webhook' }, { status: 403 });
        }

        const isSuccess = statusId === '1';

        if (isSuccess) {
            // --- SECURITY: Server-to-server verification with ToyyibPay ---
            const verifyData = new URLSearchParams();
            verifyData.append('billCode', billCode);
            const baseUrl = (process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com').trim();

            const verifyResponse = await fetch(`${baseUrl}/index.php/api/getBillTransactions`, {
                method: 'POST',
                body: verifyData,
            });
            const transactions = await verifyResponse.json();

            if (!Array.isArray(transactions) || transactions.length === 0) {
                console.error(`Webhook rejected: No transactions found for billCode ${billCode}`);
                return Response.json({ error: 'Payment verification failed' }, { status: 403 });
            }

            // Find the successful transaction and verify amount
            const successTx = transactions.find((tx: any) => tx.billpaymentStatus === '1');
            if (!successTx) {
                console.error(`Webhook rejected: ToyyibPay report shows NO successful transaction for billCode ${billCode}`);
                return Response.json({ error: 'Payment not verified' }, { status: 403 });
            }

            // Verify amount consistency (ToyyibPay sends amount in MYR as string, e.g. "100.00")
            const paidAmount = parseFloat(successTx.billpaymentAmount);
            const expectedAmount = Number(payment.amount);

            if (Math.abs(paidAmount - expectedAmount) > 0.01) {
                console.error(`Webhook rejected: Amount mismatch for order ${orderId}. Expected ${expectedAmount}, got ${paidAmount}`);
                return Response.json({ error: 'Amount mismatch' }, { status: 403 });
            }

            const orderWithItems = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            });

            if (!orderWithItems) {
                console.error(`Order ${orderId} not found`);
                return Response.json({ error: 'Order not found' }, { status: 404 });
            }

            if (orderWithItems.status === 'paid') {
                console.log(`Duplicate webhook for Order ${orderId}, skipping.`);
                return Response.json({ success: true });
            }

            // Filter out items with null productId to avoid Prisma errors
            const stockUpdates = orderWithItems.items
                .filter(item => item.productId !== null)
                .map(item =>
                    prisma.product.update({
                        where: { id: item.productId! },
                        data: {
                            stockQuantity: {
                                decrement: item.quantity
                            }
                        }
                    })
                );

            await prisma.$transaction([
                prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'paid',
                        paidAt: new Date()
                    }
                }),
                prisma.orderPayment.update({
                    where: { orderId: orderId },
                    data: {
                        status: 'completed',
                        gatewayTransactionId: transactionId,
                        rawResponse: Object.fromEntries(formData.entries()) as any
                    }
                }),
                ...stockUpdates
            ]);
            console.log(`Payment VERIFIED and Stock Decremented for Order ${orderId}`);
        } else {
            await prisma.$transaction([
                prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'failed' }
                }),
                prisma.orderPayment.update({
                    where: { orderId: orderId },
                    data: {
                        status: 'failed',
                        rawResponse: Object.fromEntries(formData.entries()) as any
                    }
                })
            ]);
            console.log(`Payment Failed for Order ${orderId}`);
        }

        return Response.json({ success: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        // Never leak internal details in production
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
