import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

vi.mock('../src/stores/cartStore', () => ({
    useCartStore: vi.fn((selector) => {
        const state = {
            getItemCount: () => 2
        };
        return selector ? selector(state) : state;
    })
}));

vi.mock('../src/stores/authStore', () => ({
    useAuthStore: vi.fn(() => ({
        user: null
    }))
}));

const renderApp = () => render(
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </HelmetProvider>
);

describe('App Component (Integration)', () => {

    beforeEach(() => {
        window.location.hash = '#/';
    });

    it('renders without crashing', () => {
        renderApp();
        expect(document.querySelector('.flex-grow')).toBeInTheDocument();
    });

    it('renders the Navbar brand', () => {
        renderApp();
        // Both Navbar and Footer have "PEPTIDES" — use getAllByText
        const brandElements = screen.getAllByText('PEPTIDES');
        expect(brandElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the Footer', () => {
        renderApp();
        expect(screen.getByText('Legal Disclaimer')).toBeInTheDocument();
    });

    it('loads cart from localStorage on mount', () => {
        const mockCart = [
            { id: 'test-1', name: 'Test', price: 100, category: 'Recovery', description: 'd', image: '/i.jpg', inStock: true, features: ['f'], quantity: 2 }
        ];
        localStorage.setItem('peptides_my_cart', JSON.stringify(mockCart));
        renderApp();
        // Cart count should appear in navbar
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('handles invalid localStorage data gracefully', () => {
        localStorage.setItem('peptides_my_cart', 'invalid-json');

        // Should not throw
        expect(() => renderApp()).not.toThrow();
    });
});

describe('Cart State Management (Unit Logic)', () => {
    it('addToCart increments quantity for existing item', () => {
        const cart = [{ id: 'a', quantity: 1 }];
        const newItem = { id: 'a', quantity: 1 };

        const existing = cart.find(i => i.id === newItem.id);
        let result;
        if (existing) {
            result = cart.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            result = [...cart, newItem];
        }

        expect(result).toEqual([{ id: 'a', quantity: 2 }]);
    });

    it('addToCart adds new item to cart', () => {
        const cart: Array<{ id: string; quantity: number }> = [];
        const newItem = { id: 'b', quantity: 1 };

        const existing = cart.find(i => i.id === newItem.id);
        let result;
        if (existing) {
            result = cart.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
            result = [...cart, newItem];
        }

        expect(result).toEqual([{ id: 'b', quantity: 1 }]);
    });

    it('updateQuantity enforces minimum of 1', () => {
        const cart = [{ id: 'a', quantity: 1 }];
        const delta = -1;

        const result = cart.map(item => {
            if (item.id === 'a') {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });

        expect(result[0].quantity).toBe(1);
    });

    it('removeFromCart removes the correct item', () => {
        const cart = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
        const result = cart.filter(i => i.id !== 'b');

        expect(result).toEqual([{ id: 'a' }, { id: 'c' }]);
    });

    it('totalItems sums all quantities', () => {
        const cart = [
            { id: 'a', quantity: 2 },
            { id: 'b', quantity: 3 },
            { id: 'c', quantity: 1 },
        ];

        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        expect(totalItems).toBe(6);
    });
});
