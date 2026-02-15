import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Beaker, User as UserIcon, LogOut, ChevronDown, Package, Archive } from 'lucide-react';
import { useCartStore } from '../src/stores/cartStore';
import AuthModal from './AuthModal';
import { useAuthStore } from '../src/stores/authStore';

const Navbar: React.FC = () => {
  const cartCount = useCartStore((state) => state.getItemCount());
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Latest', path: '/latest' },
    { name: 'Shop', path: '/shop' },
    { name: 'DNA', path: '/about' },
    { name: 'Lab Data', path: '/lab-testing' },
    { name: 'Protocols', path: '/education' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-evo-black/90 backdrop-blur-md border-b border-white/10 py-0'
          : 'bg-transparent border-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* --- LEFT SIDE: LOGO --- */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-evo-orange blur opacity-20 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-neutral-900 border border-white/10 p-1.5 rounded-lg group-hover:border-evo-orange/50 transition-colors overflow-hidden">
                  <img src="/logo/logo.png" alt="Evo Logo" className="h-8 w-8 object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight text-white leading-none group-hover:text-gray-200 transition-colors">
                  EVO<span className="text-evo-orange">PEPTIDES</span>
                </span>
              </div>
            </Link>

            {/* --- RIGHT SIDE: NAV + ACTIONS --- */}
            <div className="flex items-center gap-6">

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                    relative px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded hover:bg-white/5
                    ${isActive(link.path)
                        ? 'text-evo-orange'
                        : 'text-gray-300 hover:text-white'
                      }
                  `}
                  >
                    {link.name}
                    {link.name === 'Latest' && (
                      <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-evo-orange opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-evo-orange"></span>
                      </span>
                    )}
                    {isActive(link.path) && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-evo-orange"></span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Divider (Desktop only) */}
              <div className="hidden lg:block w-px h-8 bg-white/10 mx-2"></div>

              {/* Auth Button */}
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  {user.role === 'admin' && (
                    <div className="relative group">
                      <button className="flex items-center gap-2 px-4 py-2 bg-evo-orange/10 border border-evo-orange/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-evo-orange hover:bg-evo-orange/20 transition-all">
                        Admin <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] overflow-hidden">
                        <Link to="/admin/orders" className="flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 border-b border-zinc-800/50">
                          <Package className="w-4 h-4" /> Orders
                        </Link>
                        <Link to="/admin/products" className="flex items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">
                          <Archive className="w-4 h-4" /> Products
                        </Link>
                      </div>
                    </div>
                  )}
                  <Link to="/orders" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-300 hover:text-white transition-colors group">
                    <UserIcon className="h-4 w-4 group-hover:text-evo-orange" />
                    <span className="hidden xl:inline">History</span>
                  </Link>
                  <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-evo-orange/50 transition-all text-gray-300 hover:text-white"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Cart Button */}
              <Link to="/cart" className="relative group p-2 hover:bg-white/5 rounded-full transition-colors">
                <ShoppingCart className={`h-5 w-5 transition-colors ${cartCount > 0 ? 'text-white' : 'text-gray-400 group-hover:text-evo-orange'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-evo-orange text-[9px] font-bold text-white shadow-[0_0_10px_rgba(255,77,0,0.5)]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
              >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`
          lg:hidden absolute top-full left-0 w-full bg-evo-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-screen opacity-100 py-4 shadow-2xl' : 'max-h-0 opacity-0 py-0'}
        `}
        >
          <div className="px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`
                block px-4 py-3 rounded-lg text-base font-display font-bold uppercase tracking-widest transition-all
                ${isActive(link.path)
                    ? 'bg-evo-orange/10 text-evo-orange border-l-2 border-evo-orange'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                  }
              `}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile Auth */}
            {user ? (
              <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/orders" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-evo-orange font-bold uppercase tracking-widest bg-evo-orange/5 rounded-lg border-l-2 border-evo-orange">Manage Orders</Link>
                    <Link to="/admin/products" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-evo-orange font-bold uppercase tracking-widest bg-evo-orange/5 rounded-lg border-l-2 border-evo-orange">Manage Products</Link>
                  </>
                )}
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-400 hover:text-white font-bold uppercase tracking-widest">Order History</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-red-500 font-bold uppercase tracking-widest">Logout</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-evo-orange font-bold uppercase tracking-widest border-t border-white/10 mt-4 pt-4">Login / Register</Link>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;