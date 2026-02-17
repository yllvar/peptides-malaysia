import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as checkoutPOST } from '../../api/checkout/index';
import { prisma } from '../../api/_db';

// Mock prisma
vi.mock('../../api/_db', () => ({
    prisma: {
        order: {
            create: vi.fn(),
        },
        orderPayment: {
            create: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
        },
    },
}));

// Mock global fetch for ToyyibPay
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Checkout API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.TOYYIBPAY_SECRET_KEY = 'tp-secret';
        process.env.TOYYIBPAY_CATEGORY_CODE = 'tp-cat';
        process.env.VITE_APP_URL = 'http://localhost';

        // Default: products exist and have stock
        (prisma.product.findMany as any).mockResolvedValue([
            { id: 'p1', name: 'Product 1', stockQuantity: 10, price: 100 }
        ]);
    });

    it('should return 400 for invalid data', async () => {
        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify({ items: [] })
        });

        const res = await checkoutPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid order data');
    });

    it('should return 400 for zero or negative quantity items', async () => {
        const orderData = {
            items: [{ id: 'p1', name: 'Product 1', quantity: 0 }],
            shippingInfo: { fullName: 'J', email: 'j@e.com', phone: '601', address: 'A', city: 'C', postcode: '40000' }
        };

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        const res = await checkoutPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid quantity for item p1');
    });

    it('should return 400 if stock is insufficient', async () => {
        (prisma.product.findMany as any).mockResolvedValue([
            { id: 'p1', name: 'Product 1', stockQuantity: 1, price: 100 }
        ]);

        const orderData = {
            items: [{ id: 'p1', name: 'Product 1', quantity: 5 }],
            shippingInfo: { fullName: 'J', email: 'j@e.com', phone: '601', address: 'A', city: 'C', postcode: '40000' }
        };

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        const res = await checkoutPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toContain('Insufficient stock');
    });

    it('should successfully create order and calculate correct totals (Zone A: RM8)', async () => {
        const orderData = {
            items: [{ id: 'p1', name: 'Product 1', quantity: 2 }],
            shippingInfo: {
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '60123456789',
                address: '123 Test St',
                city: 'KL',
                postcode: '40000' // Zone A
            }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'order-1' });
        (prisma.orderPayment.create as any).mockResolvedValue({});

        mockFetch.mockResolvedValue({
            text: async () => JSON.stringify([{ BillCode: 'BILL123' }])
        });

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        const res = await checkoutPOST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.paymentUrl).toBe('https://dev.toyyibpay.com/BILL123');

        // Verify ToyyibPay Payload
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('https://dev.toyyibpay.com/index.php/api/createBill');
        const body = options.body as URLSearchParams;
        expect(body.get('billPriceSetting')).toBe('0');
        expect(body.get('billAmount')).toBe('20800'); // RM208.00 in cents

        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                subtotal: 200,
                shippingCost: 8,
                total: 208
            })
        }));
    });

    it('should apply free shipping for orders >= RM300', async () => {
        const orderData = {
            items: [{ id: 'p1', name: 'Product 1', quantity: 3 }], // 3 * 100 = 300
            shippingInfo: {
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '60123456789',
                address: '123 Test St',
                city: 'KL',
                postcode: '90000' // Zone C, but subtotal >= 300
            }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'order-1' });
        (prisma.orderPayment.create as any).mockResolvedValue({});
        mockFetch.mockResolvedValue({ text: async () => JSON.stringify([{ BillCode: 'B' }]) });

        const res = await checkoutPOST(new Request('h', { method: 'POST', body: JSON.stringify(orderData) }));

        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                subtotal: 300,
                shippingCost: 0,
                total: 300
            })
        }));
    });

    it('should return 500 if ToyyibPay fails', async () => {
        const orderData = {
            items: [{ id: 'p1', name: 'Product 1', quantity: 2 }],
            shippingInfo: {
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '60123456789',
                address: '123 Test St',
                city: 'KL',
                postcode: '40000'
            }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'order-1' });

        mockFetch.mockResolvedValue({
            text: async () => JSON.stringify({ status: 'error' })
        });

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        const res = await checkoutPOST(req);
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe('Failed to generate payment link');
    });

    it('should store guest info when no userId provided', async () => {
        const orderData = {
            items: [{ id: 'p1', name: 'P1', quantity: 1 }],
            shippingInfo: { fullName: 'Guest', email: 'g@e.com', phone: '123', address: 'A', city: 'C', postcode: '40000' }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'order-guest' });
        (prisma.orderPayment.create as any).mockResolvedValue({});
        mockFetch.mockResolvedValue({ text: async () => JSON.stringify([{ BillCode: 'BILL' }]) });

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        await checkoutPOST(req);

        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                userId: null,
                guestName: 'Guest',
                guestEmail: 'g@e.com'
            })
        }));
    });

    it('should store userId and skip guest fields when userId provided', async () => {
        const orderData = {
            userId: 'user-1',
            items: [{ id: 'p1', name: 'P1', quantity: 1 }],
            shippingInfo: { fullName: 'User', email: 'u@e.com', phone: '123', address: 'A', city: 'C', postcode: '40000' }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'order-user' });
        (prisma.orderPayment.create as any).mockResolvedValue({});
        mockFetch.mockResolvedValue({ text: async () => JSON.stringify([{ BillCode: 'BILL' }]) });

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        await checkoutPOST(req);

        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                userId: 'user-1',
                guestName: undefined
            })
        }));
    });

    it('should respect TOYYIBPAY_BASE_URL override', async () => {
        process.env.TOYYIBPAY_BASE_URL = 'https://custom-gate.com';
        const orderData = {
            items: [{ id: 'p1', name: 'P1', quantity: 1 }],
            shippingInfo: { fullName: 'U', email: 'u@e.com', phone: '1', address: 'A', city: 'C', postcode: '40000' }
        };

        (prisma.order.create as any).mockResolvedValue({ id: 'o-1' });
        (prisma.orderPayment.create as any).mockResolvedValue({});
        mockFetch.mockResolvedValue({ text: async () => JSON.stringify([{ BillCode: 'BC' }]) });

        const res = await checkoutPOST(new Request('h', { method: 'POST', body: JSON.stringify(orderData) }));
        const data = await res.json();

        expect(data.paymentUrl).toBe('https://custom-gate.com/BC');
        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe('https://custom-gate.com/index.php/api/createBill');
    });
});
