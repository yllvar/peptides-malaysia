import React, { useState } from 'react';
import { useCartStore } from '../src/stores/cartStore';
import { useAuthStore } from '../src/stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { calculateShippingCost } from '../src/lib/utils/shipping';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { cart, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        state: 'Kuala Lumpur',
    });

    const states = [
        'Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak', 'Pahang', 'Negeri Sembilan',
        'Melaka', 'Kedah', 'Kelantan', 'Terengganu', 'Perlis', 'Sabah', 'Sarawak', 'Putrajaya', 'Labuan'
    ];

    if (cart.length === 0) {
        return (
            <div className="pt-32 pb-16 bg-evo-black min-h-screen text-center">
                <h1 className="text-white text-2xl mb-4">Your cart is empty</h1>
                <Link to="/shop" className="text-evo-orange underline">Return to Shop</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    shippingInfo: form,
                    userId: user?.id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            // Redirect to ToyyibPay
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-16 bg-evo-black min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest mb-4">
                        <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-white">Checkout</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white">SECURE CHECKOUT</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Shipping Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-evo-orange/10 p-2 rounded-lg">
                                        <Truck className="h-5 w-5 text-evo-orange" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number (MY)</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. 0123456789"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Postcode</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.postcode}
                                            onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">State</label>
                                        <select
                                            value={form.state}
                                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                                            className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-evo-orange outline-none transition-colors"
                                        >
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-evo-orange/10 p-2 rounded-lg">
                                        <CreditCard className="h-5 w-5 text-evo-orange" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Payment Method</h2>
                                </div>
                                <div className="p-6 border border-evo-orange bg-evo-orange/5 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-4 w-4 rounded-full border-4 border-evo-orange bg-white"></div>
                                        <div>
                                            <div className="text-white font-bold">FPX Online Banking / Card</div>
                                            <div className="text-xs text-gray-500">Secure payment via ToyyibPay</div>
                                        </div>
                                    </div>
                                    <img src="/logo/toyyibpay.png" alt="ToyyibPay" className="h-6 opacity-80" />
                                </div>
                            </section>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-evo-orange hover:bg-orange-600 disabled:bg-gray-700 text-white font-black py-5 rounded-xl transition-all shadow-xl shadow-evo-orange/10 flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        {getTotalPrice() > 0 ? (
                                            `Pay Securely RM${(getTotalPrice() + calculateShippingCost(form.postcode, getTotalPrice())).toFixed(2)}`
                                        ) : (
                                            'Place Order (Pricing TBA)'
                                        )}
                                        <ShieldCheck className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 sticky top-32">
                            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 bg-black rounded-lg border border-white/5 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-white text-sm font-bold line-clamp-1">{item.name}</div>
                                            <div className="text-gray-500 text-xs mt-1">QTY: {item.quantity}</div>
                                            <div className="text-evo-orange text-xs font-mono mt-1">
                                                {item.price > 0 ? `RM${(item.price * item.quantity).toFixed(2)}` : 'TBA'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-white">{getTotalPrice() > 0 ? `RM${getTotalPrice().toFixed(2)}` : 'TBA'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    {calculateShippingCost(form.postcode, getTotalPrice()) === 0 ? (
                                        <span className="text-green-500 font-bold uppercase text-[10px] border border-green-500/20 px-2 rounded tracking-widest bg-green-500/5 flex items-center">Free</span>
                                    ) : (
                                        <span className="text-white">RM{calculateShippingCost(form.postcode, getTotalPrice()).toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between pt-4 border-t border-white/10">
                                    <span className="text-white font-bold uppercase tracking-wider">Total Amount</span>
                                    <span className="text-2xl font-display font-bold text-evo-orange">
                                        {getTotalPrice() > 0 ? `RM${(getTotalPrice() + calculateShippingCost(form.postcode, getTotalPrice())).toFixed(2)}` : 'TBA / INQUIRE'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest text-center justify-center">
                                <ShieldCheck className="h-3 w-3" />
                                256-bit SSL Secure Payment
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
