import { prisma } from '../../../src/lib/db';
import { requireAdmin } from '../../_auth.js';

export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        const auth = await requireAdmin(request);
        if (!auth.authorized) return auth.errorResponse!;

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
    } catch (error: any) {
        console.error('Analytics Fetch Error:', error);
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
