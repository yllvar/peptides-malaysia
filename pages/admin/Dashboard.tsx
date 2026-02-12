import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../src/stores/authStore';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    TrendingUp,
    AlertTriangle,
    Clock,
    ArrowUpRight,
    Package,
    Activity,
    ChevronRight,
    DollarSign
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
    const { user, accessToken } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/analytics', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (!res.ok) throw new Error('Failed to fetch stats');
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'admin') fetchStats();
    }, [user, accessToken]);

    if (user?.role !== 'admin') return <div className="pt-32 text-center text-white">Unauthorized</div>;

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <Activity className="w-8 h-8 text-evo-orange animate-spin" />
        </div>
    );

    return (
        <AdminLayout>
            <div className="min-h-screen pt-8 pb-12 bg-evo-black text-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-display font-bold tracking-tight">COMMAND CENTER</h1>
                        <p className="text-gray-400 mt-2">Global metabolic logistics and revenue oversight.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Total Revenue"
                            value={`RM ${data?.stats?.totalRevenue.toFixed(2)}`}
                            icon={<DollarSign className="w-5 h-5" />}
                            color="text-emerald-500"
                            bg="bg-emerald-500/10"
                        />
                        <StatCard
                            title="Active Orders"
                            value={data?.stats?.activeOrders}
                            icon={<ShoppingBag className="w-5 h-5" />}
                            color="text-evo-orange"
                            bg="bg-evo-orange/10"
                            link="/admin/orders"
                        />
                        <StatCard
                            title="Total Orders"
                            value={data?.stats?.totalOrders}
                            icon={<TrendingUp className="w-5 h-5" />}
                            color="text-blue-500"
                            bg="bg-blue-500/10"
                            link="/admin/orders"
                        />
                        <StatCard
                            title="Stock Alerts"
                            value={data?.stats?.lowStock}
                            icon={<AlertTriangle className="w-5 h-5" />}
                            color="text-red-500"
                            bg="bg-red-500/10"
                            link="/admin/products"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    Recent Operations
                                </h2>
                                <Link to="/admin/orders" className="text-xs text-evo-orange hover:underline flex items-center gap-1">
                                    View All <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {data?.recentOrders.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">No recent orders found.</p>
                                ) : data?.recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold font-mono">
                                                #{order.orderNumber.split('-')[1].slice(-3)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{order.shippingName}</p>
                                                <p className="text-[10px] text-gray-500 font-mono italic">{order.status.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">RM {parseFloat(order.total).toFixed(2)}</p>
                                            <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stock Alert Panel */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    Logistics Depletion
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {data?.lowStockProducts.length === 0 ? (
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl text-center">
                                        <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">Inventory Optimized</p>
                                    </div>
                                ) : data?.lowStockProducts.map((p: any) => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0">
                                                <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs line-clamp-1">{p.name}</p>
                                                <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{p.stockQuantity} Remaining</p>
                                            </div>
                                        </div>
                                        <Link to="/admin/products" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to="/admin/products"
                                className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                Open Inventory
                                <Package className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, color, bg, link }: any) => {
    const Card = () => (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`${bg} ${color} p-3 rounded-2xl`}>
                    {icon}
                </div>
                {link && <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />}
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-1">{title}</p>
            <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
        </div>
    );

    if (link) return <Link to={link}><Card /></Link>;
    return <Card />;
};

export default AdminDashboard;
