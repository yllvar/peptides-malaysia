import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../src/stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Search,
    Filter,
    ChevronDown,
    MoreVertical,
    MapPin,
    Calendar,
    Phone,
    Mail,
    User as UserIcon
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

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
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostcode: string;
    trackingNumber: string | null;
    courier: string | null;
    user: {
        fullName: string;
        email: string;
    } | null;
    items: OrderItem[];
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [courierInput, setCourierInput] = useState('');
    const [trackingInput, setTrackingInput] = useState('');

    const { accessToken, logout } = useAuthStore();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.status === 401) {
                logout();
                navigate('/login?from=/admin/orders');
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchOrders();
        }
    }, [accessToken]);

    const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string, courier?: string) => {
        setUpdating(orderId);
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ orderId, status, trackingNumber, courier })
            });
            if (response.status === 401) {
                logout();
                navigate('/login?from=/admin/orders');
                return;
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Update failed');

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status, trackingNumber: trackingNumber || o.trackingNumber, courier: courier || o.courier } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status, trackingNumber: trackingNumber || selectedOrder.trackingNumber, courier: courier || selectedOrder.courier });
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(null);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'delivered': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="min-h-screen pt-8 pb-12 bg-evo-black text-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3" data-testid="orders-error">
                            <XCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                                <Package className="text-evo-orange" />
                                ORDER MANAGEMENT
                            </h1>
                            <p className="text-gray-400 mt-1">Manage global operations and fulfillment.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-evo-orange transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search order number or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-evo-orange transition-all w-64"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-evo-orange transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Orders List */}
                        <div className="lg:col-span-2 space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-64 bg-zinc-900/50 rounded-3xl border border-zinc-800" data-testid="orders-loading">
                                    <Clock className="w-8 h-8 text-evo-orange animate-spin" />
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="text-center py-24 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                                    <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-gray-400">No orders found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredOrders.map(order => (
                                    <div
                                        key={order.id}
                                        data-testid={`order-item-${order.orderNumber}`}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setCourierInput(order.courier || '');
                                            setTrackingInput(order.trackingNumber || '');
                                        }}
                                        className={`p-6 bg-zinc-900/50 border rounded-3xl transition-all cursor-pointer hover:bg-zinc-900 group ${selectedOrder?.id === order.id ? 'border-evo-orange' : 'border-zinc-800'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-evo-orange font-bold text-lg">
                                                    {order.orderNumber.split('-')[1].slice(-2)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight">{order.orderNumber}</h3>
                                                    <p className="text-xs text-gray-500 font-mono tracking-tighter uppercase">{order.id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-white">RM {Number(order.total || 0).toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span>{order.shippingName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm font-mono uppercase tracking-widest text-[10px]">
                                                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Order Details Panel */}
                        <div className="lg:col-span-1">
                            {selectedOrder ? (
                                <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 sticky top-32 backdrop-blur-xl" data-testid="order-details-panel">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold">Order Details</h2>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="text-gray-500 hover:text-white transition-colors"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="space-y-4 mb-8">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Change Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['paid', 'processing', 'shipped', 'delivered', 'failed'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                                    disabled={updating === selectedOrder.id}
                                                    className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedOrder.status === status ? getStatusStyles(status) : 'border-zinc-800 hover:border-zinc-700 text-gray-400'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tracking Info */}
                                    <div className="space-y-4 mb-8">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Fulfillment</label>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Courier (e.g. Lalamove)"
                                                className="w-full bg-black border border-zinc-800 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-evo-orange transition-all"
                                                value={courierInput}
                                                onChange={(e) => setCourierInput(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tracking Number"
                                                className="w-full bg-black border border-zinc-800 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-evo-orange transition-all font-mono"
                                                value={trackingInput}
                                                onChange={(e) => setTrackingInput(e.target.value)}
                                            />
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, selectedOrder.status, trackingInput, courierInput)}
                                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10 text-xs tracking-widest uppercase"
                                            >
                                                Update Fulfillment
                                            </button>
                                        </div>
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="space-y-4 mb-8">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Shipping Information</label>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-start gap-3 text-gray-300">
                                                <UserIcon className="w-4 h-4 mt-1 text-evo-orange shrink-0" />
                                                <span>{selectedOrder.shippingName}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-300">
                                                <Phone className="w-4 h-4 mt-1 text-evo-orange shrink-0" />
                                                <span>{selectedOrder.shippingPhone}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-300">
                                                <MapPin className="w-4 h-4 mt-1 text-evo-orange shrink-0" />
                                                <span>{selectedOrder.shippingAddress}, {selectedOrder.shippingCity}, {selectedOrder.shippingPostcode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order Summary</label>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map(item => (
                                                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-zinc-800 last:border-0">
                                                    <div className="text-gray-300">
                                                        <span className="font-bold text-white">{item.quantity}x</span> {item.productName}
                                                    </div>
                                                    <div className="font-bold text-white">RM {Number(item.lineTotal || 0).toFixed(2)}</div>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                                                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Amount</div>
                                                <div className="text-2xl font-bold text-evo-orange">RM {Number(selectedOrder.total || 0).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl p-12 text-center sticky top-32">
                                    <Clock className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                    <p className="text-gray-500">Select an order from the list to view full details and manage fulfillment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
