import { prisma } from '../../../src/lib/db';
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

        // 1. Total Revenue (Paid/Shipped/Delivered orders)
        const successfulOrders = await prisma.order.findMany({
            where: {
                status: { in: ['paid', 'processing', 'shipped', 'delivered'] }
            }
        });
        const totalRevenue = successfulOrders.reduce((acc, order) => acc + Number(order.total), 0);

        // 2. Active Orders (Pending/Paid/Processing)
        const activeOrdersCount = await prisma.order.count({
            where: {
                status: { in: ['pending', 'paid', 'processing'] }
            }
        });

        // 3. Low Stock Products
        const products = await prisma.product.findMany();
        const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

        // 4. Recent Orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { fullName: true } }
            }
        });

        return Response.json({
            stats: {
                totalRevenue,
                activeOrders: activeOrdersCount,
                lowStock: lowStockProducts.length,
                totalOrders: await prisma.order.count()
            },
            recentOrders,
            lowStockProducts: lowStockProducts.slice(0, 5)
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
