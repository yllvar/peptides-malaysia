import { prisma, connectDb } from './_db.js';

export const config = {
    runtime: 'nodejs',
};

// Sanitize phone input to match database storage format (digits only)
const sanitizePhone = (phone: string): string => phone.replace(/\D/g, '');

export async function POST(request: Request) {
    try {
        await connectDb();
        const { orderNumber, phone } = await request.json();

        if (!orderNumber || !phone) {
            return Response.json({ error: 'Order Number and Phone Number are required' }, { status: 400 });
        }

        const sanitizedPhone = sanitizePhone(phone);

        // Security: STRICT match on both Order ID and Phone Number.
        // This prevents random people from guessing Order IDs.
        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber,
                shippingPhone: sanitizedPhone
            },
            select: {
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,
                shippedAt: true,
                deliveredAt: true,
                trackingNumber: true,
                courier: true,
                items: {
                    select: {
                        productName: true,
                        quantity: true,
                        lineTotal: true
                    }
                }
            }
        });

        if (!order) {
            return Response.json({ error: 'Order not found or details do not match' }, { status: 404 });
        }

        return Response.json(order);

    } catch (error: any) {
        console.error('Guest Tracking Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
