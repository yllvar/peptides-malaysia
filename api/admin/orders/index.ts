import { prisma } from '../../../src/lib/db';

export const config = {
    runtime: 'nodejs',
};
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

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
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

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
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
