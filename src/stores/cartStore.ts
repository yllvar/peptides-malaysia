import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product) => set((state) => {
                const existing = state.cart.find((i) => i.id === product.id);
                if (existing) {
                    return {
                        cart: state.cart.map((i) =>
                            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((i) => i.id !== id),
            })),
            updateQuantity: (id, delta) => set((state) => ({
                cart: state.cart.map((i) => {
                    if (i.id === id) {
                        const newQty = Math.max(1, i.quantity + delta);
                        return { ...i, quantity: newQty };
                    }
                    return i;
                }),
            })),
            clearCart: () => set({ cart: [] }),
            getItemCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
            getTotalPrice: () => get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'peptides_my_cart',
        }
    )
);
