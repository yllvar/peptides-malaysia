import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product, isSubscription?: boolean) => void;
    removeFromCart: (productId: string, isSubscription?: boolean) => void;
    updateQuantity: (productId: string, delta: number, isSubscription?: boolean) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product, isSubscription = false) => set((state) => {
                const existing = state.cart.find((i) => i.id === product.id && !!i.isSubscription === !!isSubscription);
                if (existing) {
                    return {
                        cart: state.cart.map((i) =>
                            (i.id === product.id && !!i.isSubscription === !!isSubscription)
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1, isSubscription }] };
            }),
            removeFromCart: (id, isSubscription = false) => set((state) => ({
                cart: state.cart.filter((i) => !(i.id === id && !!i.isSubscription === !!isSubscription)),
            })),
            updateQuantity: (id, delta, isSubscription = false) => set((state) => ({
                cart: state.cart.map((i) => {
                    if (i.id === id && !!i.isSubscription === !!isSubscription) {
                        const newQty = Math.max(1, i.quantity + delta);
                        return { ...i, quantity: newQty };
                    }
                    return i;
                }),
            })),
            clearCart: () => set({ cart: [] }),
            getItemCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            getTotalPrice: () => get().cart.reduce((acc, item) => {
                const price = item.isSubscription ? Number(item.price) * 0.9 : Number(item.price);
                return acc + price * item.quantity;
            }, 0),
        }),
        {
            name: 'peptides_my_cart',
        }
    )
);
