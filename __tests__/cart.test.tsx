import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../pages/Cart';
import { createMockCartItem } from './helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import * as cartStore from '../src/stores/cartStore';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

vi.mock('../src/stores/cartStore', () => ({
    useCartStore: vi.fn()
}));

vi.mock('../src/stores/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        user: null
    }))
}));

describe('Cart Page', () => {
    const mockRemoveFromCart = vi.fn();
    const mockUpdateQuantity = vi.fn();

    const defaultCartItems = [
        createMockCartItem({ id: 'item-1', name: 'Retatrutide 20mg', price: 650, quantity: 1 }),
        createMockCartItem({ id: 'item-2', name: 'BPC-157 5mg', price: 180, quantity: 2 }),
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        const state = {
            cart: defaultCartItems,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            getItemCount: () => defaultCartItems.reduce((acc, item) => acc + item.quantity, 0),
            getTotalPrice: () => defaultCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        };
        (cartStore.useCartStore as any).mockImplementation((selector: any) => selector ? selector(state) : state);
    });

    const renderCart = (cartItems = defaultCartItems) => {
        const state = {
            cart: cartItems,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            getItemCount: () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
            getTotalPrice: () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        };
        (cartStore.useCartStore as any).mockImplementation((selector: any) => selector ? selector(state) : state);

        return render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                </QueryClientProvider>
            </HelmetProvider>
        );
    };

    it('displays all cart items', () => {
        renderCart();
        expect(screen.getByText('Retatrutide 20mg')).toBeInTheDocument();
        expect(screen.getByText('BPC-157 5mg')).toBeInTheDocument();
    });

    it('calculates subtotal correctly', () => {
        renderCart();
        // 650 + (180 * 2) = 1010.00
        expect(screen.getAllByText('RM1010.00').length).toBeGreaterThan(0);
    });

    it('calculates total (subtotal + shipping) shows calculated at checkout', () => {
        renderCart();
        expect(screen.getByText('Calculated at checkout')).toBeInTheDocument();
    });

    it('calls removeFromCart when Trash icon is clicked', async () => {
        renderCart();
        const user = userEvent.setup();
        const removeButtons = screen.getAllByText(/Remove/i);

        await user.click(removeButtons[0]);
        expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
    });

    it('calls updateQuantity when + or - is clicked', async () => {
        renderCart();
        const user = userEvent.setup();
        const plusButtons = screen.getAllByText('+');
        await user.click(plusButtons[0]);
        expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', 1);

        const minusButtons = screen.getAllByText('−'); // Note the minus character used in new Cart.tsx
        await user.click(minusButtons[1]);
        expect(mockUpdateQuantity).toHaveBeenCalledWith('item-2', -1);
    });

    it('renders empty state when cart is empty', () => {
        renderCart([]);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
});
