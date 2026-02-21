import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block group">
              <span className="font-display font-bold text-2xl text-white tracking-tighter italic uppercase transition-colors group-hover:text-evo-orange">
                EVO<span className="text-gray-500 group-hover:text-white transition-colors">PEPTIDES</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Redefining the peak of Malaysian research standards. Premium grade compounds for laboratory use only.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-gray-500 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Kuala Lumpur, Malaysia</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Weight Management" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Weight Management</Link></li>
              <li><Link to="/shop?category=Recovery" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Recovery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/track" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Track Your Order</Link></li>
              <li><Link to="/lab-testing" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Lab Reports (COA)</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-evo-orange text-sm transition-colors">Research Protocols & Blog</Link></li>
            </ul>
          </div>

          {/* Warning */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-display font-bold text-evo-orange tracking-[0.2em] uppercase mb-4 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Legal Disclaimer
            </h3>
            <p className="text-[10px] text-gray-500 leading-relaxed text-justify italic">
              All products sold by Evo Peptides (Evo™) are strictly for in-vitro laboratory research purposes only. They are not intended for human consumption, diagnostic, therapeutic, or clinical use. By purchasing, you acknowledge you are a qualified researcher.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Evo Peptides. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;