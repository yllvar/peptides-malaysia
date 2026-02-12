import { prisma } from '../../../src/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ error: 'Missing email or password' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return Response.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

        // Generate Access Token (15m)
        const accessToken = await new SignJWT({ sub: user.id, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('15m')
            .sign(secret);

        // Generate Refresh Token (7d)
        const refreshToken = await new SignJWT({ sub: user.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(refreshSecret);

        // Create Session in DB (allows revocation)
        await prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return Response.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
