import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugDashboard() {
    console.log('🔍 Debugging Dashboard Data...\n');

    // 1. Check all users
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, fullName: true }
    });
    console.log('👤 Users:', JSON.stringify(users, null, 2));

    // 2. Check all orders
    const orders = await prisma.order.findMany({
        include: { items: true, payment: true },
        orderBy: { createdAt: 'desc' }
    });
    console.log(`\n📦 Orders (${orders.length} total):`);
    orders.forEach(o => {
        console.log(`   ${o.orderNumber} | Status: ${o.status} | Total: RM ${o.total} | Name: ${o.shippingName} | Phone: ${o.shippingPhone} | Created: ${o.createdAt.toISOString()}`);
        console.log(`     Items: ${o.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}`);
        if (o.payment) {
            console.log(`     Payment: ${o.payment.status} | Gateway: ${o.payment.gateway} | Ref: ${o.payment.gatewayRef}`);
        }
    });

    // 3. Simulate analytics API logic
    const successfulOrders = await prisma.order.findMany({
        where: { status: { in: ['paid', 'processing', 'shipped', 'delivered'] } }
    });
    const totalRevenue = successfulOrders.reduce((acc, order) => acc + Number(order.total), 0);
    const activeOrdersCount = await prisma.order.count({
        where: { status: { in: ['pending', 'paid', 'processing'] } }
    });
    const totalOrdersCount = await prisma.order.count();

    const products = await prisma.product.findMany();
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

    console.log('\n📊 Analytics API would return:');
    console.log(`   Total Revenue: RM ${totalRevenue.toFixed(2)}`);
    console.log(`   Active Orders: ${activeOrdersCount}`);
    console.log(`   Total Orders: ${totalOrdersCount}`);
    console.log(`   Low Stock: ${lowStockProducts.length}`);
    console.log(`   Products Total: ${products.length}`);

    await prisma.$disconnect();
}

debugDashboard().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
