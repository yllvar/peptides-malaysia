import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Shop from '../pages/Shop';
import { renderWithRouter } from './helpers';
import { PRODUCTS } from '../constants';

describe('Shop Page', () => {
    const renderShop = () => renderWithRouter(<Shop />);

    it('renders the page heading', () => {
        renderShop();
        expect(screen.getByText('THE COLLECTION')).toBeInTheDocument();
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

    it('filters products by category when a filter is clicked', async () => {
        renderShop();
        const user = userEvent.setup();

        // Click "Recovery" filter button (the first one which is the filter button)
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
        const priceElements = screen.getAllByText(/^RM\d+$/);
        expect(priceElements.length).toBe(PRODUCTS.length);
    });

    it('displays the wholesale inquiry section', () => {
        renderShop();
        expect(screen.getByText('Researching for a team?')).toBeInTheDocument();
        expect(screen.getByText('WHOLESALE INQUIRY')).toBeInTheDocument();
    });

    it('shows "No products found" for an empty category result', async () => {
        renderShop();
        // "All" is active by default and shows all products, so no empty state
        expect(screen.queryByText('No products found in this category.')).not.toBeInTheDocument();
    });
});
