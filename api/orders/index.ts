import { prisma } from '../_db.js';

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

        let userId: string;
        try {
            const { payload } = await jwtVerify(token, secret);
            userId = payload.sub as string;
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

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
