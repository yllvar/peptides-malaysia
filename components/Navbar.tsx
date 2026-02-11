import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Beaker } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
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
              <div className="relative bg-neutral-900 border border-white/10 p-2 rounded-lg group-hover:border-evo-orange/50 transition-colors">
                <Beaker className="h-5 w-5 text-evo-orange" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white leading-none group-hover:text-gray-200 transition-colors">
                PEPTIDES<span className="text-evo-orange">MALAYSIA</span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;