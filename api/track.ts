import { prisma } from './_db.js';

export const config = {
    runtime: 'nodejs',
};

// Sanitize phone input to match database storage format (digits only)
const sanitizePhone = (phone: string): string => phone.replace(/\D/g, '');

export async function POST(request: Request) {
    try {
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
            include: {
                items: true,
                payment: true
            }
        });

        if (!order) {
            // Generic error message to prevent enumeration of valid order IDs
            return Response.json({ error: 'Order not found or details do not match' }, { status: 404 });
        }

        return Response.json(order);

    } catch (error: any) {
        console.error('Guest Tracking Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
