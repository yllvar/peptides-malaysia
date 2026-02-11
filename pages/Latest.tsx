import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const Latest: React.FC = () => {
  // Filter products marked as new
  const latestProducts = PRODUCTS.filter(p => p.isNew);

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      {/* Page Header */}
      <div className="bg-neutral-900 border-b border-white/5 pb-16 pt-8 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
                <Sparkles className="h-6 w-6 text-blue-400 mr-2 animate-pulse" />
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">New Arrivals & Bundles</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                LATEST DROPS
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover our newest research protocols, value stacks, and limited-time bundles designed for the evolving Malaysian scientist.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group block relative">
              {/* Card Container */}
              <div className="h-full bg-neutral-900 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1">
                
                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60"></div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* New Badge */}
                  <div className="absolute top-4 left-4 z-20">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider flex items-center">
                          <Zap className="w-3 h-3 mr-1 fill-current" /> New!
                      </span>
                  </div>

                  {/* Optional Custom Badge */}
                  {product.badge && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-evo-orange text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white text-black text-center py-3 font-bold text-sm uppercase tracking-wide rounded hover:bg-gray-200 transition-colors">
                          View Details
                      </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col h-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider border border-blue-500/30 px-2 py-0.5 rounded">
                        {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                      {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
                      {product.description}
                  </p>
                  
                  <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase">Research Kit</span>
                        <span className="text-lg font-bold text-white">RM{product.price}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State Safety */}
        {latestProducts.length === 0 && (
            <div className="text-center py-20 bg-neutral-900 border border-white/10 rounded-lg">
                <p className="text-gray-400">New products are arriving soon. Check back later.</p>
                <Link to="/shop" className="inline-block mt-4 text-evo-orange font-bold hover:underline">Browse Full Collection</Link>
            </div>
        )}

        {/* Promo Banner */}
        <div className="mt-24 relative rounded-2xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="relative p-12 md:p-24 text-center">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">CUSTOM BULK PROTOCOLS?</h2>
                <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-8">
                    Running a large-scale longitudinal study? We offer specialized pricing and custom packaging for institutional orders over 10 kits.
                </p>
                <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                    REQUEST WHOLESALE QUOTE <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Latest;