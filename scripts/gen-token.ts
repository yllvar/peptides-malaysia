import 'dotenv/config';
import { SignJWT } from 'jose';

async function generateAdminToken() {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ sub: 'admin-test', role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);
    console.log(token);
}

generateAdminToken();
