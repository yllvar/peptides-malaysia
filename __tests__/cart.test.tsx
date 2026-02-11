import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Cart from '../pages/Cart';
import { createMockCartItem, renderWithRouter } from './helpers';
import { WHATSAPP_NUMBER } from '../constants';

describe('Cart Page', () => {
    const mockRemoveFromCart = vi.fn();
    const mockUpdateQuantity = vi.fn();

    const defaultCartItems = [
        createMockCartItem({ id: 'item-1', name: 'Retatrutide 20mg', price: 650, quantity: 1 }),
        createMockCartItem({ id: 'item-2', name: 'BPC-157 5mg', price: 180, quantity: 2 }),
    ];

    const renderCart = (cart = defaultCartItems) =>
        renderWithRouter(
            <Cart cart={cart} removeFromCart={mockRemoveFromCart} updateQuantity={mockUpdateQuantity} />
        );

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Empty Cart', () => {
        it('renders empty state with link to shop', () => {
            renderWithRouter(
                <Cart cart={[]} removeFromCart={mockRemoveFromCart} updateQuantity={mockUpdateQuantity} />
            );
            expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
            expect(screen.getByText('Browse Shop')).toBeInTheDocument();
        });
    });

    describe('Cart with Items', () => {
        it('displays all cart items', () => {
            renderCart();
            expect(screen.getByText('Retatrutide 20mg')).toBeInTheDocument();
            expect(screen.getByText('BPC-157 5mg')).toBeInTheDocument();
        });

        it('calculates subtotal correctly', () => {
            renderCart();
            // 650*1 + 180*2 = 1010 — Subtotal line
            expect(screen.getByText('RM1010')).toBeInTheDocument();
        });

        it('displays shipping cost', () => {
            renderCart();
            // Shipping is RM10 — appears in the summary
            const shippingElements = screen.getAllByText('RM10');
            expect(shippingElements.length).toBeGreaterThanOrEqual(1);
        });

        it('calculates total (subtotal + shipping)', () => {
            renderCart();
            // 1010 + 10 = 1020
            expect(screen.getByText('RM1020')).toBeInTheDocument();
        });

        it('calls removeFromCart when Remove is clicked', async () => {
            renderCart();
            const removeButtons = screen.getAllByText('Remove');
            await userEvent.click(removeButtons[0]);
            expect(mockRemoveFromCart).toHaveBeenCalledWith('item-1');
        });

        it('calls updateQuantity with +1 when + is clicked', async () => {
            renderCart();
            const plusButtons = screen.getAllByText('+');
            await userEvent.click(plusButtons[0]);
            expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', 1);
        });

        it('calls updateQuantity with -1 when - is clicked', async () => {
            renderCart();
            const minusButtons = screen.getAllByText('-');
            await userEvent.click(minusButtons[0]);
            expect(mockUpdateQuantity).toHaveBeenCalledWith('item-1', -1);
        });
    });

    describe('Form Validation', () => {
        it('shows error when fields are empty', async () => {
            renderCart();
            const checkoutBtn = screen.getByText('COMPLETE ORDER');
            await userEvent.click(checkoutBtn);
            expect(screen.getByText('Please fill in ALL shipping details to generate the order.')).toBeInTheDocument();
        });

        it('shows error for invalid phone number', async () => {
            renderCart();
            const user = userEvent.setup();

            await user.type(screen.getByPlaceholderText('Researcher Name'), 'Test User');
            await user.type(screen.getByPlaceholderText('+60...'), '012345'); // Too short
            await user.type(screen.getByPlaceholderText('Unit, Building, Street'), '123 Test St');
            await user.type(screen.getByPlaceholderText('Kuala Lumpur'), 'KL');
            await user.type(screen.getByPlaceholderText('50450'), '50000');

            await user.click(screen.getByText('COMPLETE ORDER'));
            expect(screen.getByText('Invalid Phone Number. Use format: 60123456789')).toBeInTheDocument();
        });

        it('shows error for invalid postcode', async () => {
            renderCart();
            const user = userEvent.setup();

            await user.type(screen.getByPlaceholderText('Researcher Name'), 'Test User');
            await user.type(screen.getByPlaceholderText('+60...'), '60123456789');
            await user.type(screen.getByPlaceholderText('Unit, Building, Street'), '123 Test St');
            await user.type(screen.getByPlaceholderText('Kuala Lumpur'), 'KL');
            await user.type(screen.getByPlaceholderText('50450'), '123'); // Too short

            await user.click(screen.getByText('COMPLETE ORDER'));
            expect(screen.getByText('Invalid Postcode. Must be exactly 5 digits.')).toBeInTheDocument();
        });

        it('opens WhatsApp with valid form data', async () => {
            renderCart();
            const user = userEvent.setup();

            await user.type(screen.getByPlaceholderText('Researcher Name'), 'Test User');
            await user.type(screen.getByPlaceholderText('+60...'), '60123456789');
            await user.type(screen.getByPlaceholderText('Unit, Building, Street'), '123 Test St');
            await user.type(screen.getByPlaceholderText('Kuala Lumpur'), 'KL');
            await user.type(screen.getByPlaceholderText('50450'), '50000');

            await user.click(screen.getByText('COMPLETE ORDER'));

            expect(window.open).toHaveBeenCalledTimes(1);
            const calledUrl = (window.open as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
            expect(calledUrl).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
            expect(calledUrl).toContain('NEW%20ORDER');
        });

        it('clears error when user types in a field', async () => {
            renderCart();
            const user = userEvent.setup();

            // Trigger error
            await user.click(screen.getByText('COMPLETE ORDER'));
            expect(screen.getByText('Please fill in ALL shipping details to generate the order.')).toBeInTheDocument();

            // Type in a field should clear the error
            await user.type(screen.getByPlaceholderText('Researcher Name'), 'A');
            expect(screen.queryByText('Please fill in ALL shipping details to generate the order.')).not.toBeInTheDocument();
        });
    });
});
