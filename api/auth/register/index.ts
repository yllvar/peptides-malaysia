import { prisma } from '../../../src/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, fullName, phone } = await request.json();

        if (!email || !password || !fullName) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return Response.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                phone,
            },
        });

        return Response.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
