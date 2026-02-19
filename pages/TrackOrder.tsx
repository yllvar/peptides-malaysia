import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    ArrowRight,
    Loader2,
    AlertCircle,
    CheckCircle,
    Package,
    Truck,
    Clock,
    Box,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

interface OrderItem {
    id: string;
    productName: string;
    productPrice: number;
    quantity: number;
    lineTotal: number;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    trackingNumber: string | null;
    courier: string | null;
    items: OrderItem[];
    shippingName: string;
    shippingCity: string;
}

const TrackOrder: React.FC = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState<Order | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);

        try {
            const response = await fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderNumber, phone })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to track order');
            }

            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500"><CheckCircle className="w-5 h-5" /></div>;
            case 'shipped': return <div className="p-2 rounded-full bg-blue-500/10 text-blue-500"><Truck className="w-5 h-5" /></div>;
            case 'delivered': return <div className="p-2 rounded-full bg-purple-500/10 text-purple-500"><Package className="w-5 h-5" /></div>;
            case 'failed': return <div className="p-2 rounded-full bg-red-500/10 text-red-500"><Box className="w-5 h-5" /></div>;
            default: return <div className="p-2 rounded-full bg-amber-500/10 text-amber-500"><Clock className="w-5 h-5" /></div>;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-evo-black text-white px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display tracking-tight uppercase mb-4">Track Protocol</h1>
                    <p className="text-gray-400">Enter your assignment credentials to access sensitive logistics data.</p>
                </div>

                {/* Search Form */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 backdrop-blur-xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Search className="w-64 h-64 -rotate-12" />
                    </div>

                    <form onSubmit={handleTrack} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Order ID Reference</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g. EVO-17362819"
                                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-zinc-700 font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Verification Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 0123456789"
                                className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-evo-orange outline-none transition-all placeholder:text-zinc-700 font-mono"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-evo-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Decrypting...</>
                            ) : (
                                <>Locate Record <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 text-red-400 mb-8 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-1">Access Denied</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success/Result State */}
                {order && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px bg-zinc-800 flex-grow"></div>
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Record Found</span>
                            <div className="h-px bg-zinc-800 flex-grow"></div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-zinc-700 transition-all duration-500">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="flex items-center gap-6">
                                        {getStatusIcon(order.status)}
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            order.status === 'delivered' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white mb-1">RM {Number(order.total).toFixed(2)}</div>
                                        <div className="text-xs text-gray-500 font-mono tracking-tighter uppercase">Ship to: {order.shippingCity}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-800/50">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Compounds</h4>
                                        <div className="space-y-3">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-zinc-800">
                                                    <div className="text-sm">
                                                        <span className="text-evo-orange font-bold mr-2">{item.quantity}x</span>
                                                        <span className="text-gray-300">{item.productName}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        {order.trackingNumber ? (
                                            <div className="bg-evo-orange/5 border border-evo-orange/20 rounded-3xl p-6">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-evo-orange mb-2">Tracking Active</h4>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white font-mono font-bold mb-1">{order.trackingNumber}</p>
                                                        <p className="text-xs text-gray-400 capitalize">{order.courier || 'Malaysian Courier'}</p>
                                                    </div>
                                                    <div className="p-3 bg-evo-orange rounded-xl">
                                                        <Truck className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-zinc-800/20 border border-zinc-800 rounded-3xl p-6 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-400 font-medium">Tracking currently pending</p>
                                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Updated post-logistics</p>
                                                </div>
                                                <Clock className="w-5 h-5 text-zinc-700" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
