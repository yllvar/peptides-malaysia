import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    ChevronLeft,
    LogOut,
    ExternalLink,
    XCircle
} from 'lucide-react';
import { useAuthStore } from '../../src/stores/authStore';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    React.useEffect(() => {
        if (!user) {
            navigate(`/login?from=${location.pathname}`);
        }
    }, [user, navigate, location.pathname]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-evo-black text-white flex flex-col items-center justify-center p-4">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
                <p className="text-gray-400 mb-8 text-center max-w-md">
                    You do not have access to the research command center.
                    Please sign in with an administrative account.
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all"
                >
                    Return to Home
                </Link>
            </div>
        );
    }

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
        { path: '/admin/products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-evo-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 flex flex-col sticky top-0 h-screen bg-black/50 backdrop-blur-xl">
                <div className="p-8">
                    <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
                        EVO<span className="text-evo-orange">™</span>
                        <span className="text-[10px] bg-evo-orange/10 text-evo-orange px-2 py-0.5 rounded-full tracking-widest uppercase">Admin</span>
                    </div>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(item.path)
                                ? 'bg-evo-orange text-white shadow-lg shadow-evo-orange/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-800 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Shop
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-x-hidden pt-0 mt-0">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
