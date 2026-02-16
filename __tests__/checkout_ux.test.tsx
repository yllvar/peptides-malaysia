import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { useCartStore } from '../src/stores/cartStore';
import { useAuthStore } from '../src/stores/authStore';

// Mock the stores
vi.mock('../src/stores/cartStore', () => ({
    useCartStore: vi.fn(),
}));

vi.mock('../src/stores/authStore', () => ({
    useAuthStore: vi.fn(),
}));

// Mock window.location.href
const mockLocationFetch = vi.fn();
delete (window as any).location;
(window as any).location = { href: '' };

describe('Checkout UX Integration', () => {
    const mockCart = [
        { id: '1', name: 'Product 1', price: 100, quantity: 1, image: '/p1.jpg' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useCartStore as any).mockReturnValue({
            cart: mockCart,
            getTotalPrice: () => 100,
            clearCart: vi.fn(),
        });
        (useAuthStore as any).mockReturnValue({
            user: { fullName: 'Test User', email: 'test@example.com' },
        });

        // Mock fetch
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            text: async () => JSON.stringify({ paymentUrl: 'https://payment.gate/123' }),
        });
    });

    it('should redirect back to shop if cart is empty', () => {
        (useCartStore as any).mockReturnValue({
            cart: [],
            getTotalPrice: () => 0,
        });

        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        expect(screen.getByText(/Your cart is empty/i)).toBeDefined();
        expect(screen.getByText(/Return to Shop/i)).toBeDefined();
    });

    it('should show shipping zone and estimate when a valid postcode is entered', async () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        const postcodeField = screen.getByPlaceholderText(/5-Digit Code/i);

        // Enter a Zone A postcode (KL/Selangor)
        fireEvent.change(postcodeField, { target: { value: '43300' } });

        expect(screen.getByText(/KL \/ Selangor \(Zone A\)/i)).toBeDefined();
        expect(screen.getByText(/ETA: 1-2 Days/i)).toBeDefined();

        // Enter a Zone C postcode (East Malaysia)
        fireEvent.change(postcodeField, { target: { value: '88000' } });
        expect(screen.getByText(/East Malaysia \(Zone C\)/i)).toBeDefined();
        expect(screen.getByText(/ETA: 5-7 Days/i)).toBeDefined();
    });

    it('should update the total price dynamically based on shipping zone', async () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        const postcodeField = screen.getByPlaceholderText(/5-Digit Code/i);

        // Zone B default (100 + 12 = 112)
        expect((await screen.findAllByText(/112\.00/)).length).toBeGreaterThanOrEqual(1);

        // Change to Zone A (RM8 shipping) (100 + 8 = 108)
        fireEvent.change(postcodeField, { target: { value: '43300' } });
        expect((await screen.findAllByText(/108\.00/)).length).toBeGreaterThanOrEqual(1);

        // Change to Zone C (RM18 shipping) (100 + 18 = 118)
        fireEvent.change(postcodeField, { target: { value: '88000' } });
        expect((await screen.findAllByText(/118\.00/)).length).toBeGreaterThanOrEqual(1);
    });

    it('should validate form fields and prevent submission with errors', async () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        // Find and submit the form
        const formElement = screen.getByRole('form', { name: /checkout-form/i });
        fireEvent.submit(formElement);

        expect(await screen.findByText(/Invalid MY phone number/i)).toBeDefined();
        expect(await screen.findByText(/Postcode must be 5 digits/i)).toBeDefined();
        expect(screen.queryByText(/Encrypting Transmission/i)).toBeNull();
    });

    it('should show loading state and handle successful redirection', async () => {
        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/Receiver Name/i), { target: { value: 'John Jantan' } });
        fireEvent.change(screen.getByPlaceholderText(/0123456789/i), { target: { value: '0197378180' } });
        fireEvent.change(screen.getByPlaceholderText(/Street name/i), { target: { value: 'Test Address Line 12345' } });
        fireEvent.change(screen.getByPlaceholderText(/5-Digit Code/i), { target: { value: '43300' } });
        fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Seri Kembangan' } });

        const submitBtn = screen.getByRole('button', { name: /SECURE SETTLEMENT/i });

        fireEvent.click(submitBtn);

        // Should show loading state
        expect(screen.getByText(/Encrypting Transmission/i)).toBeDefined();

        // Wait for potential async effects (though fetch is mocked)
        await vi.waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    it('should display error message if API fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            text: async () => JSON.stringify({ error: 'Gateway timeout' }),
        });

        render(
            <BrowserRouter>
                <Checkout />
            </BrowserRouter>
        );

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/Receiver Name/i), { target: { value: 'John Jantan' } });
        fireEvent.change(screen.getByPlaceholderText(/0123456789/i), { target: { value: '0197378180' } });
        fireEvent.change(screen.getByPlaceholderText(/Street name/i), { target: { value: 'Test Address Line 12345' } });
        fireEvent.change(screen.getByPlaceholderText(/5-Digit Code/i), { target: { value: '43300' } });
        fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Seri Kembangan' } });

        const submitBtn = screen.getByRole('button', { name: /SECURE SETTLEMENT/i });
        fireEvent.click(submitBtn);

        await vi.waitFor(() => {
            expect(screen.getByText(/Gateway timeout/i)).toBeDefined();
            expect(screen.getByText(/Authorization Error/i)).toBeDefined();
        });
    });
});
