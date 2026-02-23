import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../src/stores/cartStore';
import { Product } from '../../src/types';

describe('Cart Store with Subscriptions', () => {
    const mockProduct: Product = {
        id: 'p1',
        name: 'Test Product',
        price: 100,
        category: 'Recovery',
        description: 'Desc',
        image: 'img.jpg',
        inStock: true,
        features: []
    };

    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('adds a one-time purchase item correctly', () => {
        useCartStore.getState().addToCart(mockProduct, false);
        const cart = useCartStore.getState().cart;

        expect(cart).toHaveLength(1);
        expect(cart[0].id).toBe('p1');
        expect(cart[0].isSubscription).toBe(false);
        expect(useCartStore.getState().getTotalPrice()).toBe(100);
    });

    it('adds a subscription item correctly with 10% discount', () => {
        useCartStore.getState().addToCart(mockProduct, true);
        const cart = useCartStore.getState().cart;

        expect(cart).toHaveLength(1);
        expect(cart[0].id).toBe('p1');
        expect(cart[0].isSubscription).toBe(true);
        // 100 * 0.9 = 90
        expect(useCartStore.getState().getTotalPrice()).toBe(90);
    });

    it('keeps one-time and subscription items separate', () => {
        useCartStore.getState().addToCart(mockProduct, false);
        useCartStore.getState().addToCart(mockProduct, true);

        const cart = useCartStore.getState().cart;
        expect(cart).toHaveLength(2);
        expect(cart.find(i => !i.isSubscription)).toBeDefined();
        expect(cart.find(i => i.isSubscription)).toBeDefined();
        // 100 + 90 = 190
        expect(useCartStore.getState().getTotalPrice()).toBe(190);
    });

    it('increments quantity correctly for both types', () => {
        useCartStore.getState().addToCart(mockProduct, false);
        useCartStore.getState().addToCart(mockProduct, false);
        useCartStore.getState().addToCart(mockProduct, true);
        useCartStore.getState().addToCart(mockProduct, true);

        const cart = useCartStore.getState().cart;
        expect(cart).toHaveLength(2);
        expect(cart.find(i => !i.isSubscription)?.quantity).toBe(2);
        expect(cart.find(i => i.isSubscription)?.quantity).toBe(2);
        // (100 * 2) + (90 * 2) = 200 + 180 = 380
        expect(useCartStore.getState().getTotalPrice()).toBe(380);
    });

    it('removes correct items based on subscription flag', () => {
        useCartStore.getState().addToCart(mockProduct, false);
        useCartStore.getState().addToCart(mockProduct, true);

        useCartStore.getState().removeFromCart('p1', false);

        const cart = useCartStore.getState().cart;
        expect(cart).toHaveLength(1);
        expect(cart[0].isSubscription).toBe(true);
    });

    it('updates quantity correctly based on subscription flag', () => {
        useCartStore.getState().addToCart(mockProduct, false);
        useCartStore.getState().addToCart(mockProduct, true);

        useCartStore.getState().updateQuantity('p1', 1, true);

        const cart = useCartStore.getState().cart;
        expect(cart.find(i => !i.isSubscription)?.quantity).toBe(1);
        expect(cart.find(i => i.isSubscription)?.quantity).toBe(2);
    });
});
