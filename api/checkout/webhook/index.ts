import { prisma } from '../../../src/lib/db';

export const config = {
    runtime: 'nodejs',
};

/**
 * Verify payment server-to-server with ToyyibPay API.
 * Returns true only if ToyyibPay confirms the bill is paid.
 */
async function verifyPaymentWithGateway(billCode: string): Promise<boolean> {
    try {
        const verifyData = new URLSearchParams();
        verifyData.append('billCode', billCode);

        const response = await fetch('https://toyyibpay.com/index.php/api/getBillTransactions', {
            method: 'POST',
            body: verifyData,
        });

        const transactions = await response.json();

        if (Array.isArray(transactions) && transactions.length > 0) {
            // billpaymentStatus '1' = Success in ToyyibPay
            return transactions.some((tx: any) => tx.billpaymentStatus === '1');
        }
        return false;
    } catch (err) {
        console.error('ToyyibPay verification failed:', err);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const statusId = formData.get('status_id')?.toString();
        const orderId = formData.get('order_id')?.toString();
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
            const verified = await verifyPaymentWithGateway(billCode);
            if (!verified) {
                console.error(`Webhook rejected: ToyyibPay verification failed for billCode ${billCode}`);
                return Response.json({ error: 'Payment verification failed' }, { status: 403 });
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
