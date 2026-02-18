import { jwtVerify } from 'jose';

export interface AuthResult {
    authorized: boolean;
    userId?: string;
    role?: string;
    errorResponse?: Response;
}

/**
 * Verifies the JWT token from the Authorization header.
 * Returns an AuthResult with either the user info or a pre-built error Response.
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            authorized: false,
            errorResponse: Response.json({ error: 'Unauthorized' }, { status: 401 }),
        };
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    try {
        const { payload } = await jwtVerify(token, secret);
        return {
            authorized: true,
            userId: payload.sub,
            role: payload.role as string,
        };
    } catch (err) {
        return {
            authorized: false,
            errorResponse: Response.json({ error: 'Invalid token' }, { status: 401 }),
        };
    }
}

/**
 * Verifies the JWT token and checks for admin role.
 */
export async function requireAdmin(request: Request): Promise<AuthResult> {
    const auth = await requireAuth(request);
    if (!auth.authorized) return auth;

    if (auth.role !== 'admin') {
        return {
            authorized: false,
            errorResponse: Response.json({ error: 'Forbidden' }, { status: 403 }),
        };
    }

    return auth;
}
