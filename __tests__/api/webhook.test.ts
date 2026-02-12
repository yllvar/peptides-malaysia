import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../api/checkout/webhook/index';
import { prisma } from '../../src/lib/db';

vi.mock('../../src/lib/db', () => ({
    prisma: {
        order: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        orderPayment: {
            update: vi.fn(),
        },
        product: {
            update: vi.fn(),
        },
        $transaction: vi.fn((promises) => Promise.all(promises)),
    },
}));

describe('Checkout Webhook API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully process a successful payment and decrement stock', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'order-123');
        formData.append('transaction_id', 'trans-456');

        const mockOrder = {
            id: 'order-123',
            items: [
                { productId: 'prod-1', quantity: 2 },
                { productId: 'prod-2', quantity: 1 },
            ]
        };

        (prisma.order.findUnique as any).mockResolvedValue(mockOrder);

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // Check if stock update was called for each product
        expect(prisma.product.update).toHaveBeenCalledTimes(2);
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { id: 'prod-1' },
            data: { stockQuantity: { decrement: 2 } }
        });
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { id: 'prod-2' },
            data: { stockQuantity: { decrement: 1 } }
        });

        // Check if order status was updated
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 'order-123' },
            data: expect.objectContaining({ status: 'paid' })
        });
    });

    it('should handle failed payment', async () => {
        const formData = new FormData();
        formData.append('status_id', '2'); // Failed status
        formData.append('order_id', 'order-123');

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // Stock should NOT be updated
        expect(prisma.product.update).not.toHaveBeenCalled();

        // Order status should be failed
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 'order-123' },
            data: { status: 'failed' }
        });
    });

    it('should return 400 for missing parameters', async () => {
        const formData = new FormData();
        // Missing order_id

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Missing parameters');
    });

    it('should return 500 when orderId does not exist in database', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'non-existent-order');
        formData.append('transaction_id', 'trans-123');

        (prisma.order.findUnique as any).mockResolvedValue(null);

        // prisma.order.update will throw because update requires record to exist
        (prisma.order.update as any).mockRejectedValue(new Error('Record to update not found.'));

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        // The implementation now returns 404 on order not found
        expect(response.status).toBe(404);
        expect((await response.json()).error).toBe('Order not found');
    });

    it('should not decrement stock if order is already paid (idempotency)', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'already-paid-order');
        formData.append('transaction_id', 'trans-999');

        const mockPaidOrder = {
            id: 'already-paid-order',
            status: 'paid',
            items: [
                { productId: 'prod-1', quantity: 1 }
            ]
        };

        (prisma.order.findUnique as any).mockResolvedValue(mockPaidOrder);

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // CRITICAL: Stock should NOT be updated again
        expect(prisma.product.update).not.toHaveBeenCalled();
        // Order update might be skipped or just return success
        expect(prisma.order.update).not.toHaveBeenCalled();
    });
});
