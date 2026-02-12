import { prisma } from '../../../src/lib/db';

export const config = {
    runtime: 'nodejs',
};
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, fullName, phone } = await request.json();

        if (!email || !password || !fullName) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Password strength validation
        if (password.length < 8) {
            return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return Response.json({ error: 'Password must contain at least one uppercase letter and one number' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        if (existingUser) {
            return Response.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase().trim(),
                passwordHash: hashedPassword,
                fullName: fullName.trim(),
                phone: phone?.trim() || null,
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

    } catch (error: any) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
