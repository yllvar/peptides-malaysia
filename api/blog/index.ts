import { prisma } from '../_db.js';

export const config = {
    runtime: 'nodejs',
};

export async function GET(request: Request) {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
        });
        return Response.json(posts);
    } catch (error: any) {
        return Response.json({
            error: 'Failed to fetch blog posts',

        }, { status: 500 });
    }
}
