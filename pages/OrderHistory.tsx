import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../src/stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    Clock,
    Truck,
    CheckCircle,
    ChevronRight,
    Search,
    ArrowLeft,
    Box,
    ExternalLink
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
}

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, accessToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, accessToken, navigate]);

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
        <div className="min-h-screen pt-32 pb-24 bg-evo-black text-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/" className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold font-display tracking-tight uppercase">Order History</h1>
                        <p className="text-gray-400 mt-1">Track and manage your research logistics.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900/30 rounded-[3rem] border border-dashed border-zinc-800">
                        <Package className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
                        <h3 className="text-xl font-bold mb-2">No research orders yet</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">Your metabolic research orders will appear here once you've completed a checkout.</p>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-evo-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all">
                            Visit Shop
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-zinc-700 transition-all duration-500">
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
                                                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white mb-1">RM {parseFloat(order.total.toString()).toFixed(2)}</div>
                                            <div className="text-xs text-gray-500 font-mono tracking-tighter uppercase">{order.id.slice(0, 8)}...</div>
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
                                                        <div className="text-sm font-bold">RM {parseFloat(item.lineTotal.toString()).toFixed(2)}</div>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
