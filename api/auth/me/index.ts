import { jwtVerify } from 'jose';
import { prisma } from '../../../src/lib/db';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    try {
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.sub as string;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, fullName: true, role: true }
        });

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        return Response.json({ user });
    } catch (err) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
}
