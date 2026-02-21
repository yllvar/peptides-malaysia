import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../api/checkout/webhook/index';
import { prisma } from '../../api/_db.js';

vi.mock('../../api/_db.js', () => ({
    connectDb: vi.fn().mockResolvedValue(undefined), prisma: {
        order: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        orderPayment: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        product: {
            update: vi.fn(),
        },
        $transaction: vi.fn((promises) => Promise.all(promises)),
    },
}));

// Mock global fetch for ToyyibPay verification
global.fetch = vi.fn();

vi.mock('../../src/lib/email.js', () => ({
    sendOrderReceivedEmail: vi.fn().mockResolvedValue({ success: true })
}));

describe('Checkout Webhook API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully process a successful payment and decrement stock', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'order-123');
        formData.append('billcode', 'BILL123');
        formData.append('transaction_id', 'trans-456');

        (prisma.orderPayment.findUnique as any).mockResolvedValue({
            orderId: 'order-123',
            gatewayRef: 'BILL123',
            amount: 200
        });

        (global.fetch as any).mockResolvedValue({
            json: async () => [{ billpaymentStatus: '1', billpaymentAmount: '200.00' }]
        });

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

        // Verify ToyyibPay Verification URL usage (default to sandbox in tests)
        const [url] = (global.fetch as any).mock.calls[0];
        expect(url).toBe('https://dev.toyyibpay.com/index.php/api/getBillTransactions');

        // Check if stock update was called for each product
        expect(prisma.product.update).toHaveBeenCalledTimes(2);
    });

    it('should handle failed payment', async () => {
        const formData = new FormData();
        formData.append('status_id', '2'); // Failed status
        formData.append('order_id', 'order-123');
        formData.append('billcode', 'BILL123');

        (prisma.orderPayment.findUnique as any).mockResolvedValue({
            orderId: 'order-123',
            gatewayRef: 'BILL123'
        });

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // Order status should be failed
        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: 'order-123' },
            data: { status: 'failed' }
        });
    });

    it('should return 400 for missing parameters', async () => {
        const formData = new FormData();
        // Missing billcode

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Missing parameters');
    });

    it('should return 404 when orderId does not exist in database', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'non-existent-order');
        formData.append('billcode', 'BILL-MISSING');
        formData.append('transaction_id', 'trans-123');

        (prisma.orderPayment.findUnique as any).mockResolvedValue({
            orderId: 'non-existent-order',
            gatewayRef: 'BILL-MISSING',
            amount: 50
        });

        (global.fetch as any).mockResolvedValue({
            json: async () => [{ billpaymentStatus: '1', billpaymentAmount: '50.00' }]
        });

        (prisma.order.findUnique as any).mockResolvedValue(null);

        const request = new Request('http://localhost/api/checkout/webhook', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(request);
        expect(response.status).toBe(404);
        expect((await response.json()).error).toBe('Order not found');
    });

    it('should not decrement stock if order is already paid (idempotency)', async () => {
        const formData = new FormData();
        formData.append('status_id', '1');
        formData.append('order_id', 'already-paid-order');
        formData.append('billcode', 'BILL-PAID');
        formData.append('transaction_id', 'trans-999');

        (prisma.orderPayment.findUnique as any).mockResolvedValue({
            orderId: 'already-paid-order',
            gatewayRef: 'BILL-PAID',
            amount: 100
        });

        (global.fetch as any).mockResolvedValue({
            json: async () => [{ billpaymentStatus: '1', billpaymentAmount: '100.00' }]
        });

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
    });
});
