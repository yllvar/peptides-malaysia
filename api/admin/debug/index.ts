import { prisma } from '../../_db.js';

export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        const orderCount = await prisma.order.count();
        const productCount = await prisma.product.count();

        const successfulOrders = await prisma.order.findMany({
            where: { status: { in: ['paid', 'processing', 'shipped', 'delivered'] } }
        });
        const totalRevenue = successfulOrders.reduce((acc, order) => acc + Number(order.total), 0);

        return Response.json({
            ok: true,
            orderCount,
            productCount,
            totalRevenue: totalRevenue.toFixed(2)
        });
    } catch (error: any) {
        return Response.json({
            error: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            name: error.name
        }, { status: 500 });
    }
}
