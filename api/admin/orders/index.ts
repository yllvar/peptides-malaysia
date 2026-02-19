import { prisma } from '../../_db.js';
import { requireAdmin } from '../../_auth.js';

export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        const auth = await requireAdmin(request);
        if (!auth.authorized) return auth.errorResponse!;

        const orders = await prisma.order.findMany({
            include: {
                items: true,
                payment: true,
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return Response.json(orders);
    } catch (error: any) {
        console.error('Admin Orders Fetch Error:', error);
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const auth = await requireAdmin(request);
        if (!auth.authorized) return auth.errorResponse!;

        const { orderId, status, trackingNumber, courier } = await request.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const updateData: any = { status };
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (courier !== undefined) updateData.courier = courier;

        if (status === 'shipped') {
            updateData.shippedAt = new Date();
        } else if (status === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: updateData
        });

        return Response.json(updatedOrder);
    } catch (error: any) {
        console.error('Admin Order Update Error:', error);
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
