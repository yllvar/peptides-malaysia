import { prisma } from '../../../src/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const statusId = formData.get('status_id')?.toString();
        const orderId = formData.get('order_id')?.toString();
        const billCode = formData.get('billcode')?.toString();
        const transactionId = formData.get('transaction_id')?.toString();

        if (!orderId || !statusId) {
            return Response.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const isSuccess = statusId === '1';

        // Update Order and Payment records
        if (isSuccess) {
            // Fetch order items to update stock
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

            const stockUpdates = orderWithItems?.items.map(item =>
                prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity
                        }
                    }
                })
            ) || [];

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
            console.log(`Payment Success and Stock Decremented for Order ${orderId}`);
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

    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
