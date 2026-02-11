import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from '../pages/ProductDetail';
import { PRODUCTS, COA_DATA } from '../constants';

/**
 * Renders ProductDetail within a proper Route context so useParams works.
 */
function renderProductDetail(productId: string) {
    const addToCart = vi.fn();
    const result = render(
        <MemoryRouter initialEntries={[`/product/${productId}`]}>
            <Routes>
                <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            </Routes>
        </MemoryRouter>
    );
    return { ...result, addToCart };
}

describe('Product Detail Page', () => {
    const retatrutide = PRODUCTS[0]; // evo-retat-kit

    it('shows "Product not found" for invalid ID', () => {
        render(
            <MemoryRouter initialEntries={['/product/nonexistent-id']}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetail addToCart={vi.fn()} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Product not found')).toBeInTheDocument();
    });

    it('renders product name and price', () => {
        renderProductDetail(retatrutide.id);
        // Product name appears in heading and breadcrumb — use getByRole for heading
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(retatrutide.name);
        expect(screen.getByText(`RM${retatrutide.price}`)).toBeInTheDocument();
    });

    it('renders product image', () => {
        renderProductDetail(retatrutide.id);
        const img = screen.getByAltText(retatrutide.name);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', retatrutide.image);
    });

    it('renders product features / specifications', () => {
        renderProductDetail(retatrutide.id);
        retatrutide.features.forEach(feat => {
            // Some features contain > which is HTML-encoded; use partial regex match
            const escapedFeat = feat.replace('>', '&gt;');
            const elements = screen.getAllByText((content) => content.includes(feat) || content.includes(escapedFeat));
            expect(elements.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('has ADD TO CART and BUY VIA WHATSAPP buttons', () => {
        renderProductDetail(retatrutide.id);
        // These texts include SVG icons, so they may be split — use regex partial match
        expect(screen.getByText(/ADD TO CART/)).toBeInTheDocument();
        expect(screen.getByText(/BUY VIA WHATSAPP/)).toBeInTheDocument();
    });

    it('calls addToCart when ADD TO CART is clicked', async () => {
        const { addToCart } = renderProductDetail(retatrutide.id);
        const user = userEvent.setup();

        await user.click(screen.getByText(/ADD TO CART/));

        expect(addToCart).toHaveBeenCalledTimes(1);
        expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({
            id: retatrutide.id,
            name: retatrutide.name,
            quantity: 1,
        }));
    });

    it('opens WhatsApp when BUY VIA WHATSAPP is clicked', async () => {
        renderProductDetail(retatrutide.id);
        const user = userEvent.setup();

        await user.click(screen.getByText(/BUY VIA WHATSAPP/));

        expect(window.open).toHaveBeenCalledTimes(1);
        const calledUrl = (window.open as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
        expect(calledUrl).toContain('wa.me');
        expect(calledUrl).toContain(encodeURIComponent(retatrutide.name));
    });

    describe('Tabs', () => {
        it('shows DESCRIPTION tab content by default', () => {
            renderProductDetail(retatrutide.id);
            // Check for partial description text
            expect(screen.getByText(/zenith of metabolic capability/i)).toBeInTheDocument();
        });

        it('switches to RECONSTITUTION tab', async () => {
            renderProductDetail(retatrutide.id);
            const user = userEvent.setup();

            await user.click(screen.getByText('RECONSTITUTION'));

            expect(screen.getByText('Important Protocol')).toBeInTheDocument();
        });

        it('switches to LAB DATA (COA) tab and shows matching COA data', async () => {
            renderProductDetail(retatrutide.id);
            const user = userEvent.setup();

            await user.click(screen.getByText('LAB DATA (COA)'));

            // Should find matching COA for Retatrutide
            const matchingCoa = COA_DATA.find(c =>
                retatrutide.name.includes(c.productName) || c.productName.includes(retatrutide.name)
            );

            if (matchingCoa) {
                expect(screen.getByText(matchingCoa.productName)).toBeInTheDocument();
            }
        });
    });

    it('displays breadcrumbs', () => {
        renderProductDetail(retatrutide.id);
        // Breadcrumbs show Home / Shop / ProductName
        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThanOrEqual(1);
        const shopLinks = screen.getAllByText('Shop');
        expect(shopLinks.length).toBeGreaterThanOrEqual(1);
    });
});
