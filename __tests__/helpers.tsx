import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { CartItem, Product } from '../src/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

/**
 * Renders a component wrapped in MemoryRouter and QueryClientProvider for testing.
 */
export function renderWithRouter(
    ui: ReactElement,
    routerProps?: MemoryRouterProps,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter {...routerProps}>{children}</MemoryRouter>
        </QueryClientProvider>
    );
    return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Factory: creates a mock Product with sensible defaults.
 */
export function createMockProduct(overrides: Partial<Product> = {}): Product {
    return {
        id: 'test-product',
        name: 'Test Peptide 10mg',
        price: 100,
        category: 'Recovery',
        description: 'A test product for unit testing.',
        image: '/images/test.jpg',
        inStock: true,
        features: ['Feature A', 'Feature B'],
        ...overrides,
    };
}

/**
 * Factory: creates a mock CartItem (Product + quantity).
 */
export function createMockCartItem(overrides: Partial<CartItem> = {}): CartItem {
    return {
        ...createMockProduct(),
        quantity: 1,
        ...overrides,
    };
}
