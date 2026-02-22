import React, { useState } from 'react';
import { useCartStore } from '../src/stores/cartStore';
import { useAuthStore } from '../src/stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, CreditCard, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { calculateShippingCost } from '../src/lib/utils/shipping';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { cart, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
            <div className="pt-32 pb-16 bg-evo-black min-h-screen flex flex-col items-center justify-center px-4">
                <div className="bg-neutral-900 border border-white/5 p-12 rounded-3xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-evo-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-10 w-10 text-evo-orange" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-4 uppercase italic">Your cart is empty</h1>
                    <p className="text-gray-500 mb-8 text-sm">Select from our peer-reviewed research compounds to proceed with checkout.</p>
                    <Link to="/shop" className="inline-block w-full bg-evo-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors uppercase tracking-widest text-xs">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'manual'>('manual');

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (form.fullName.length < 3) errors.fullName = 'Full name is too short';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address';
        if (!/^(01)[0-46-9]-*[0-9]{7,8}$/.test(form.phone.replace(/\s|-/g, ''))) {
            errors.phone = 'Invalid MY phone number (e.g. 0123456789)';
        }
        if (!/^[0-9]{5}$/.test(form.postcode)) errors.postcode = 'Postcode must be 5 digits';
        if (form.address.length < 10) errors.address = 'Please provide a more detailed address';
        if (!form.city) errors.city = 'City is required';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const shippingCost = calculateShippingCost(form.postcode, getTotalPrice());

    // Determine shipping zone for UX feedback
    const getZoneLabel = (pc: string) => {
        if (!/^[0-9]{5}$/.test(pc)) return null;
        const prefix = parseInt(pc.substring(0, 2));
        if (prefix >= 40 && prefix <= 68) return { label: 'KL / Selangor (Zone A)', eta: '1-2 Days' };
        if (prefix >= 88 && prefix <= 91) return { label: 'East Malaysia (Zone C)', eta: '5-7 Days' };
        return { label: 'Peninsular (Zone B)', eta: '2-4 Days' };
    };
    const zoneInfo = getZoneLabel(form.postcode);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    shippingInfo: form,
                    userId: user?.id,
                    paymentMethod: paymentMethod
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (pErr) {
                console.error('Non-JSON response:', text);
                throw new Error('A server error occurred. Please try again later.');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            if (data.method === 'manual') {
                // Redirect to status page with manual flag and order ID
                navigate(`/payment/status?method=manual&order_id=${data.orderId}&order_number=${data.orderNumber}`);
            } else if (data.paymentUrl) {
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
                    <h1 className="text-4xl font-display font-bold text-white italic uppercase tracking-tighter">SECURE <span className="text-gray-700 font-normal">CHECKOUT</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Shipping Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} aria-label="checkout-form" className="space-y-8">

                            <section className="bg-neutral-900/50 border border-white/5 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-evo-orange/10 p-2 rounded-xl">
                                        <Truck className="h-5 w-5 text-evo-orange" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Shipping Details</h2>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Instrument delivery logistics</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Full Legal Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.fullName}
                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                            className={`w-full bg-black border ${fieldErrors.fullName ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-gray-700`}
                                            placeholder="Receiver Name"
                                        />
                                        {fieldErrors.fullName && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Contact Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className={`w-full bg-black border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-gray-700`}
                                            placeholder="researcher@example.com"
                                        />
                                        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Mobile Logistics (MY)</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. 0123456789"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className={`w-full bg-black border ${fieldErrors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-gray-700`}
                                        />
                                        {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.phone}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Laboratory/Delivery Address</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className={`w-full bg-black border ${fieldErrors.address ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all resize-none placeholder:text-gray-700`}
                                            placeholder="Street name, Building, Unit#"
                                        />
                                        {fieldErrors.address && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Postcode</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            required
                                            value={form.postcode}
                                            onChange={(e) => setForm({ ...form, postcode: e.target.value.replace(/[^0-9]/g, '') })}
                                            className={`w-full bg-black border ${fieldErrors.postcode ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-gray-700`}
                                            placeholder="5-Digit Code"
                                        />
                                        {fieldErrors.postcode && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.postcode}</p>}
                                        {zoneInfo && (
                                            <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {zoneInfo.label} • ETA: {zoneInfo.eta}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">District/City</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            className={`w-full bg-black border ${fieldErrors.city ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-gray-700`}
                                            placeholder="City"
                                        />
                                        {fieldErrors.city && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase italic tracking-widest">{fieldErrors.city}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Administrative State</label>
                                        <select
                                            value={form.state}
                                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all cursor-pointer"
                                        >
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-neutral-900/50 border border-white/5 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-evo-orange/10 p-2 rounded-xl">
                                        <CreditCard className="h-5 w-5 text-evo-orange" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Payment Selection</h2>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Financial settlement protocol</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div
                                        onClick={() => setPaymentMethod('manual')}
                                        className={`p-6 border cursor-pointer rounded-2xl flex items-center justify-between group transition-all duration-300 ${paymentMethod === 'manual' ? 'border-evo-orange bg-evo-orange/5' : 'border-white/5 bg-black/20 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center p-0.5 ${paymentMethod === 'manual' ? 'border-evo-orange' : 'border-gray-700'}`}>
                                                {paymentMethod === 'manual' && <div className="w-full h-full rounded-full bg-evo-orange shadow-[0_0_10px_rgba(255,87,34,0.5)]"></div>}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold tracking-tight">Direct Bank Transfer</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mt-0.5 font-medium italic">Instant Verification via WhatsApp Receipt</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="bg-white/5 px-3 py-1 rounded-md text-[8px] font-bold text-gray-400 border border-white/5">UOB</div>
                                            <div className="bg-white/5 px-3 py-1 rounded-md text-[8px] font-bold text-gray-400 border border-white/5">DUITNOW</div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('gateway')}
                                        className={`p-6 border cursor-pointer rounded-2xl flex items-center justify-between group transition-all duration-300 ${paymentMethod === 'gateway' ? 'border-evo-orange bg-evo-orange/5' : 'border-white/5 bg-black/20 hover:border-white/10 opacity-60 grayscale hover:grayscale-0'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center p-0.5 ${paymentMethod === 'gateway' ? 'border-evo-orange' : 'border-gray-700'}`}>
                                                {paymentMethod === 'gateway' && <div className="w-full h-full rounded-full bg-evo-orange shadow-[0_0_10px_rgba(255,87,34,0.5)]"></div>}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold tracking-tight">FPX / Credit Card</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mt-0.5 font-medium">ToyyibPay Secure Encryption</div>
                                            </div>
                                        </div>
                                        <img src="/logo/toyibpay-logo.webp" alt="ToyyibPay" className="h-4 opacity-50" />
                                    </div>
                                </div>
                            </section>

                            {error && (
                                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-500 text-xs animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-black uppercase tracking-widest block mb-1">Authorization Error</span>
                                        <p className="font-light italic">{error}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative group overflow-hidden"
                            >
                                <div className={`w-full bg-evo-orange group-hover:bg-orange-600 disabled:bg-neutral-800 text-white font-black py-6 rounded-2xl transition-all shadow-2xl ${!loading && 'shadow-evo-orange/20'} flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-xs`}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Initializing Protocol...
                                        </>
                                    ) : (
                                        <>
                                            {getTotalPrice() > 0 ? (
                                                `INITIALIZE ORDER: RM${(getTotalPrice() + shippingCost).toFixed(2)}`
                                            ) : (
                                                'Incomplete Protocol'
                                            )}
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-1 group-hover:translate-y-0 transition-transform"></div>
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-neutral-900 border border-white/10 rounded-[2.5rem] p-10 lg:sticky lg:top-32 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <ShieldCheck className="w-48 h-48 rotate-12" />
                            </div>

                            <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tighter italic">Batch <span className="text-gray-600 font-normal">Manifest</span></h2>

                            <div className="space-y-6 mb-10">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="h-20 w-20 bg-black rounded-2xl border border-white/5 overflow-hidden flex-shrink-0 group-hover:border-evo-orange/30 transition-colors">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <div className="flex-grow py-1">
                                            <div className="text-white text-sm font-bold tracking-tight mb-1 group-hover:text-evo-orange transition-colors">{item.name}</div>
                                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Protocol QTY: {item.quantity} units</div>
                                            <div className="text-white text-sm font-mono mt-2">
                                                {item.price > 0 ? `RM${(item.price * item.quantity).toFixed(2)}` : 'TBA'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-8">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                                    <span className="text-gray-600">Metric Subtotal</span>
                                    <span className="text-white">{getTotalPrice() > 0 ? `RM${getTotalPrice().toFixed(2)}` : 'VALIDATING'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
                                    <span className="text-gray-600">Logistics (Shipping)</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-[9px]">EXEMPT (FREE)</span>
                                    ) : (
                                        <span className="text-white">RM{shippingCost.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end pt-8 border-t border-white/10 mb-2">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] block mb-1">TOTAL LIQUIDITY</span>
                                        <span className="text-white text-[10px] font-medium opacity-40 uppercase tracking-widest italic">Includes analytical oversight</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-4xl font-display font-bold text-evo-orange tracking-tighter">
                                            {getTotalPrice() > 0 ? `RM${(getTotalPrice() + shippingCost).toFixed(2)}` : 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-white/10"></div>
                                    <div className="flex items-center gap-2 text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">
                                        <ShieldCheck className="h-3 w-3 text-evo-orange" />
                                        Secure Analytical Environment
                                    </div>
                                    <div className="h-px w-8 bg-white/10"></div>
                                </div>
                                <div className="text-[7px] text-gray-700 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                                    All transmissions are isolated and encrypted via industry-leading SSL protocols. No credit card data is stored on Evo servers.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
