import { prisma } from '../_db.js';
import { requireAuth } from '../_auth.js';

export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        const auth = await requireAuth(request);
        if (!auth.authorized) return auth.errorResponse!;

        const userId = auth.userId!;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
                payment: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return Response.json(orders);
    } catch (error: any) {
        console.error('User Orders Fetch Error:', error);
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
