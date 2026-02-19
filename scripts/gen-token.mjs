import 'dotenv/config';
import { createHmac } from 'crypto';

// Manual JWT creation to avoid jose crypto issues on Node 18
function base64url(str) {
    return Buffer.from(str).toString('base64url');
}

const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const now = Math.floor(Date.now() / 1000);
const payload = base64url(JSON.stringify({
    sub: 'admin-test',
    role: 'admin',
    iat: now,
    exp: now + 3600
}));

const signature = createHmac('sha256', process.env.JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

console.log(`${header}.${payload}.${signature}`);
