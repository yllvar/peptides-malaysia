export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        // Dynamic import to catch errors
        const { prisma } = await import('../../../src/lib/db');

        const orderCount = await prisma.order.count();
        return Response.json({ ok: true, orderCount });
    } catch (error: any) {
        return Response.json({
            error: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            name: error.name
        }, { status: 500 });
    }
}
