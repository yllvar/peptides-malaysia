import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../src/stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    Image as ImageIcon,
    Tag,
    Layers,
    ShoppingCart,
    Archive,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface TechnicalSpec {
    id?: string;
    molecularFormula?: string;
    molarMass?: string;
    researchFocus?: string;
    halfLife?: string;
    category?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    compareAtPrice: number | string | null;
    category: string;
    description: string;
    imageUrl: string;
    badge: string | null;
    isNew: boolean;
    inStock: boolean;
    stockQuantity: number;
    lowStockThreshold: number;
    isPublished: boolean;
    sortOrder: number;
    features: string[];
    techSpecs?: TechnicalSpec[];
    createdAt?: string;
    updatedAt?: string;
}

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        isPublished: true,
        inStock: true,
        isNew: false,
        stockQuantity: 50,
        lowStockThreshold: 5,
        sortOrder: 0,
        features: [],
        techSpecs: [{}]
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);

    const { user, accessToken, logout } = useAuthStore();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.status === 401) {
                logout();
                navigate('/login?from=/admin/products');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') fetchProducts();
    }, [user, accessToken]);

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct({
            isPublished: true,
            inStock: true,
            isNew: true,
            stockQuantity: 50,
            lowStockThreshold: 5,
            sortOrder: 0,
            features: [],
            techSpecs: [{}]
        });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const method = (currentProduct as Product).createdAt ? 'PATCH' : 'POST';

        try {
            const response = await fetch('/api/admin/products', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(currentProduct)
            });

            if (response.status === 401) {
                logout();
                navigate('/login?from=/admin/products');
                return;
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save product');
            }

            await fetchProducts();
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/admin/products?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.status === 401) {
                logout();
                navigate('/login?from=/admin/products');
                return;
            }
            if (!response.ok) throw new Error('Failed to delete');
            await fetchProducts();
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (user?.role !== 'admin') {
        return <div className="min-h-screen pt-32 text-center">Unauthorized</div>;
    }

    return (
        <AdminLayout>
            <div className="min-h-screen pt-8 pb-12 bg-evo-black text-white px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                                <Archive className="text-evo-orange" />
                                PRODUCT MANAGEMENT
                            </h1>
                            <p className="text-gray-400 mt-1">Configure your metabolic catalog across all logistics hubs.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setFilterLowStock(!filterLowStock)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filterLowStock ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-zinc-700'}`}
                            >
                                <AlertCircle className="w-4 h-4" />
                                {filterLowStock ? 'Showing Low Stock' : 'Filter Low Stock'}
                            </button>
                            <button
                                onClick={handleAddNew}
                                className="bg-evo-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add New Product
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-evo-orange" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products
                                .filter(p => filterLowStock ? p.stockQuantity <= p.lowStockThreshold : true)
                                .map(product => {
                                    const isLowStock = product.stockQuantity <= product.lowStockThreshold;
                                    return (
                                        <div key={product.id} className={`bg-zinc-900/50 border rounded-[2rem] p-6 transition-all hover:border-zinc-700 ${!product.isPublished ? 'opacity-60 border-dashed' : 'border-zinc-800'} ${isLowStock ? 'ring-2 ring-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center overflow-hidden">
                                                        {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" alt="" /> : <Package className="text-zinc-700" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white leading-tight">{product.name}</h3>
                                                        <p className="text-[10px] text-gray-500 font-mono">{product.id}</p>
                                                    </div>
                                                </div>
                                                {!product.isPublished && <span className="text-[9px] font-bold bg-zinc-800 text-gray-500 py-1 px-2 rounded-full uppercase tracking-widest">Draft</span>}
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-xl font-bold text-white">RM {parseFloat(product.price.toString()).toFixed(2)}</div>
                                                <div className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${isLowStock ? 'bg-red-500 text-white animate-pulse' : product.stockQuantity > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {isLowStock && <AlertCircle className="w-3 h-3" />}
                                                    {product.stockQuantity} in stock
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="flex-grow bg-white/5 hover:bg-white/10 text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-8 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
                                <h2 className="text-2xl font-bold font-display">
                                    {(currentProduct as any).createdAt ? 'EDIT PRODUCT' : 'NEW RESEARCH PRODUCT'}
                                </h2>
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {error && <div className="col-span-full bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">{error}</div>}

                                {/* Column 1: Core Logistics */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Internal ID (Permanent)</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!!(currentProduct as any).createdAt}
                                            value={currentProduct.id || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, id: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all disabled:opacity-30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProduct.name || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Price (RM)</label>
                                            <input
                                                type="number"
                                                required
                                                value={currentProduct.price || ''}
                                                onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Stock Level</label>
                                            <input
                                                type="number"
                                                required
                                                value={currentProduct.stockQuantity || 0}
                                                onChange={e => setCurrentProduct({ ...currentProduct, stockQuantity: parseInt(e.target.value) })}
                                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Display & Alerts */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Slug (URL Path)</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProduct.slug || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                            className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all font-mono"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Low Stock Alert Level</label>
                                            <input
                                                type="number"
                                                required
                                                value={currentProduct.lowStockThreshold || 5}
                                                onChange={e => setCurrentProduct({ ...currentProduct, lowStockThreshold: parseInt(e.target.value) })}
                                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Visibility</label>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentProduct({ ...currentProduct, isPublished: !currentProduct.isPublished })}
                                                className={`w-full py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${currentProduct.isPublished ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
                                            >
                                                {currentProduct.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {currentProduct.isPublished ? 'Live' : 'Hidden'}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Features / Badge</label>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentProduct({ ...currentProduct, isNew: !currentProduct.isNew })}
                                            className={`w-full py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${currentProduct.isNew ? 'bg-evo-orange/10 border-evo-orange/30 text-evo-orange' : 'border-zinc-800 text-gray-500'}`}
                                        >
                                            <Tag className="w-3.5 h-3.5" /> {currentProduct.isNew ? 'New Release' : 'Standard'}
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Technical Description</label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={currentProduct.description || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Features Section */}
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Key Features (One per line)</label>
                                    <textarea
                                        rows={3}
                                        value={(currentProduct.features || []).join('\n')}
                                        onChange={e => setCurrentProduct({ ...currentProduct, features: e.target.value.split('\n').filter(f => f.trim() !== '') })}
                                        placeholder="Enter each feature on a new line..."
                                        className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all resize-none font-sans"
                                    />
                                </div>

                                {/* Technical Specifications Section */}
                                <div className="col-span-full p-6 bg-black/40 border border-zinc-800 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-evo-orange" />
                                        Analytical Data (Tech Specs)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Molecular Formula</label>
                                            <input
                                                type="text"
                                                value={currentProduct.techSpecs?.[0]?.molecularFormula || ''}
                                                onChange={e => {
                                                    const specs = [...(currentProduct.techSpecs || [{}])];
                                                    specs[0] = { ...specs[0], molecularFormula: e.target.value };
                                                    setCurrentProduct({ ...currentProduct, techSpecs: specs });
                                                }}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs focus:border-evo-orange outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Molar Mass</label>
                                            <input
                                                type="text"
                                                value={currentProduct.techSpecs?.[0]?.molarMass || ''}
                                                onChange={e => {
                                                    const specs = [...(currentProduct.techSpecs || [{}])];
                                                    specs[0] = { ...specs[0], molarMass: e.target.value };
                                                    setCurrentProduct({ ...currentProduct, techSpecs: specs });
                                                }}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs focus:border-evo-orange outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Half Life</label>
                                            <input
                                                type="text"
                                                value={currentProduct.techSpecs?.[0]?.halfLife || ''}
                                                onChange={e => {
                                                    const specs = [...(currentProduct.techSpecs || [{}])];
                                                    specs[0] = { ...specs[0], halfLife: e.target.value };
                                                    setCurrentProduct({ ...currentProduct, techSpecs: specs });
                                                }}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs focus:border-evo-orange outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Research Focus</label>
                                            <input
                                                type="text"
                                                value={currentProduct.techSpecs?.[0]?.researchFocus || ''}
                                                onChange={e => {
                                                    const specs = [...(currentProduct.techSpecs || [{}])];
                                                    specs[0] = { ...specs[0], researchFocus: e.target.value };
                                                    setCurrentProduct({ ...currentProduct, techSpecs: specs });
                                                }}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs focus:border-evo-orange outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Spec Category</label>
                                            <input
                                                type="text"
                                                value={currentProduct.techSpecs?.[0]?.category || ''}
                                                onChange={e => {
                                                    const specs = [...(currentProduct.techSpecs || [{}])];
                                                    specs[0] = { ...specs[0], category: e.target.value };
                                                    setCurrentProduct({ ...currentProduct, techSpecs: specs });
                                                }}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-xs focus:border-evo-orange outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Image URL</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            required
                                            value={currentProduct.imageUrl || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                                            className="flex-grow bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-evo-orange outline-none transition-all"
                                        />
                                        <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                                            <img src={currentProduct.imageUrl} className="w-full h-full object-cover" alt="" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full pt-8 border-t border-zinc-800 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-3 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-evo-orange hover:bg-orange-600 px-12 py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
