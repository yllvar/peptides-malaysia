import { prisma } from '../../_db.js';

export const config = {
    runtime: 'nodejs',
};

/**
 * API for Twilio/Railway Bot to check order status
 * Requires 'x-bot-key' header
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const botKey = request.headers.get('x-bot-key');
    const query = searchParams.get('q'); // Can be phone or order number

    if (!botKey || botKey !== process.env.BOT_API_KEY) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!query) {
        return Response.json({ error: 'Missing query parameter q' }, { status: 400 });
    }

    try {
        // Normalize query: remove spaces, leadings '+', etc if it's a phone
        const cleanQuery = query.replace(/[+\s-]/g, '');

        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { orderNumber: { contains: query, mode: 'insensitive' } },
                    { shippingPhone: { contains: cleanQuery } },
                    // If cleanQuery starts with '6', also check without '6'
                    ...(cleanQuery.startsWith('6') ? [{ shippingPhone: { contains: cleanQuery.slice(1) } }] : []),
                    // If cleanQuery doesn't start with '6', check with '6' (common in MY)
                    ...(!cleanQuery.startsWith('6') ? [{ shippingPhone: { contains: '6' + cleanQuery } }] : []),
                ]
            },
            select: {
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,
                trackingNumber: true,
                courier: true,
                shippingName: true,
                items: {
                    select: {
                        productName: true,
                        quantity: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 3 // Only last 3 orders
        });

        if (orders.length === 0) {
            return Response.json({ message: 'No orders found matching that identifier.' }, { status: 404 });
        }

        return Response.json({ orders });
    } catch (error) {
        console.error('Bot Order Status Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
