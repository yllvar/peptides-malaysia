import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/** 
 * Connection Resilience: Handles serverless cold-starts.
 * This ensures the Prisma client is connected before the API logic executes.
 */
export async function connectDb() {
    try {
        await prisma.$connect();
    } catch (error) {
        console.error('Prisma connection failed, retrying...', error);
        // Simple one-time retry for serverless wake-up
        await new Promise(res => setTimeout(res, 200));
        await prisma.$connect();
    }
}
