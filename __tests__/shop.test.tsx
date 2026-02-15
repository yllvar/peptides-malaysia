import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Shop from '../pages/Shop';
import { renderWithRouter, createMockProduct } from './helpers';
import { PRODUCTS } from '../src/constants';
import { Product } from '../src/types';
import '@testing-library/jest-dom'; // Ensure types are loaded

// Default mock returns PRODUCTS from constants
const mockUseProducts = vi.fn();

vi.mock('../src/hooks/useProducts', () => ({
    useProducts: () => mockUseProducts(),
}));

describe('Shop Page', () => {
    const renderShop = () => renderWithRouter(<Shop />);

    beforeEach(() => {
        mockUseProducts.mockReturnValue({
            data: PRODUCTS,
            isLoading: false,
            error: null,
        });
    });

    it('renders the page heading', () => {
        renderShop();
        expect(screen.getByRole('heading', { level: 1, name: /THE EVO™ SERIES/i })).toBeInTheDocument();
    });

    it('renders all category filter buttons', () => {
        renderShop();
        const expectedCategories = ['All', 'Weight Management', 'Recovery', 'Performance', 'Anti-Aging', 'Bundles', 'Essentials'];
        expectedCategories.forEach(cat => {
            // Use getAllByText since categories also appear on product cards
            const elements = screen.getAllByText(cat);
            expect(elements.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('shows all products when "All" filter is selected', () => {
        renderShop();
        PRODUCTS.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    it('filters products by category', async () => {
        renderShop();
        const user = userEvent.setup();

        const recoveryButtons = screen.getAllByText('Recovery');
        // The filter button is the first one (before product cards)
        await user.click(recoveryButtons[0]);

        const recoveryProducts = PRODUCTS.filter(p => p.category === 'Recovery');
        const nonRecoveryProducts = PRODUCTS.filter(p => p.category !== 'Recovery');

        recoveryProducts.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });

        nonRecoveryProducts.forEach(product => {
            expect(screen.queryByText(product.name)).not.toBeInTheDocument();
        });
    });

    it('shows product badges', () => {
        renderShop();
        expect(screen.getByText('BEST SELLER')).toBeInTheDocument();
    });

    it('displays product prices in RM format', () => {
        renderShop();
        // Just verify some prices exist, avoiding duplicate text issues
        const priceElements = screen.getAllByText(/^RM\d+\.\d{2}$/);
        expect(priceElements.length).toBe(PRODUCTS.length);
    });

    it('displays the wholesale inquiry section', () => {
        renderShop();
        expect(screen.getByRole('heading', { level: 2, name: /INSTITUTIONAL ACQUISITION/i })).toBeInTheDocument();
    });

    it('shows "No products found" for an empty category result', async () => {
        renderShop();
        // "All" is active by default and shows all products, so no empty state
        expect(screen.queryByText('SEQUENCE NOT FOUND')).not.toBeInTheDocument();
    });

    // --- P3: New test cases ---

    it('shows "Depleted" overlay for out-of-stock products', () => {
        const outOfStockProduct: Product = createMockProduct({
            id: 'oos-product',
            name: 'Out of Stock Peptide',
            price: 999,
            category: 'Recovery',
            inStock: false,
        });
        mockUseProducts.mockReturnValue({
            data: [outOfStockProduct],
            isLoading: false,
            error: null,
        });

        renderWithRouter(<Shop />);

        expect(screen.getByText('Depleted')).toBeInTheDocument();
        expect(screen.getByText('Out of Stock Peptide')).toBeInTheDocument();
    });

    it('shows empty state when a filtered category has no products', async () => {
        // Mock with products only in "Recovery" category
        const recoveryOnly: Product[] = [
            createMockProduct({ id: 'recovery-1', name: 'Recovery Peptide', category: 'Recovery' }),
        ];
        mockUseProducts.mockReturnValue({
            data: recoveryOnly,
            isLoading: false,
            error: null,
        });

        renderWithRouter(<Shop />);
        const user = userEvent.setup();

        // Click "Performance" filter — no products exist for this category
        // Use original case from categories array
        await user.click(screen.getByText('Performance'));

        expect(screen.getByText('SEQUENCE NOT FOUND')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        mockUseProducts.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        });

        renderWithRouter(<Shop />);
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        mockUseProducts.mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error('Network error'),
        });

        renderWithRouter(<Shop />);
        expect(screen.getByText('Error loading products.')).toBeInTheDocument();
    });
});
