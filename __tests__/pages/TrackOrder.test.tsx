import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrackOrder from '../../pages/TrackOrder';

// Mock fetch globally
global.fetch = vi.fn();

describe('TrackOrder Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () => {
        return render(
            <BrowserRouter>
                <TrackOrder />
            </BrowserRouter>
        );
    };

    it('should render the search form initially', () => {
        renderPage();

        expect(screen.getByText('Track Protocol')).toBeDefined();
        expect(screen.getByPlaceholderText(/e.g. EVO-17362819/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/e.g. 0123456789/i)).toBeDefined();
        expect(screen.getByText('Locate Record')).toBeDefined();
    });

    it('should handle input changes', () => {
        renderPage();

        const orderInput = screen.getByPlaceholderText(/e.g. EVO-17362819/i) as HTMLInputElement;
        const phoneInput = screen.getByPlaceholderText(/e.g. 0123456789/i) as HTMLInputElement;

        fireEvent.change(orderInput, { target: { value: 'EVO-123' } });
        fireEvent.change(phoneInput, { target: { value: '0123456789' } });

        expect(orderInput.value).toBe('EVO-123');
        expect(phoneInput.value).toBe('0123456789');
    });

    it('should display order details on successful tracking', async () => {
        const mockOrder = {
            id: '1',
            orderNumber: 'EVO-123',
            status: 'shipped',
            total: 150.00,
            createdAt: new Date().toISOString(),
            trackingNumber: 'JT112233',
            courier: 'J&T Express',
            shippingName: 'Dr. Test',
            shippingCity: 'Cyberjaya',
            items: [
                { id: 'i1', productName: 'Test Product', quantity: 2, lineTotal: 100 }
            ]
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockOrder
        });

        renderPage();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/e.g. EVO-17362819/i), { target: { value: 'EVO-123' } });
        fireEvent.change(screen.getByPlaceholderText(/e.g. 0123456789/i), { target: { value: '0123456789' } });

        // Submit
        const submitBtn = screen.getByText('Locate Record');
        fireEvent.click(submitBtn);

        // Verify loading state
        expect(screen.getByText('Decrypting...')).toBeDefined();

        // Verify result
        await waitFor(() => {
            expect(screen.getByText('Record Found')).toBeDefined();
            expect(screen.getByText('EVO-123')).toBeDefined();
            expect(screen.getByText('shipped')).toBeDefined();
            expect(screen.getByText('RM 150.00')).toBeDefined();
            expect(screen.getByText('JT112233')).toBeDefined();
            expect(screen.getByText('Test Product')).toBeDefined();
        });
    });

    it('should display error message on failed tracking', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Order not found or details do not match' })
        });

        renderPage();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/e.g. EVO-17362819/i), { target: { value: 'EVO-999' } });
        fireEvent.change(screen.getByPlaceholderText(/e.g. 0123456789/i), { target: { value: '0123456789' } });

        // Submit
        fireEvent.click(screen.getByText('Locate Record'));

        await waitFor(() => {
            expect(screen.getByText('Access Denied')).toBeDefined();
            expect(screen.getByText('Order not found or details do not match')).toBeDefined();
        });
    });
});
