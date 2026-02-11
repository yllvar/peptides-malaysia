import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, WHATSAPP_NUMBER } from '../constants';
import { Product } from '../types';

const Shop: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Weight Management', 'Recovery', 'Performance', 'Anti-Aging', 'Bundles', 'Essentials'];

  const filteredProducts = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">THE COLLECTION</h1>
          <p className="text-gray-400">High-purity ligands and solvents for advanced research.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                ? 'bg-evo-orange text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group block">
              <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-evo-orange/50 hover:shadow-2xl hover:shadow-evo-orange/10">
                <div className="relative aspect-square overflow-hidden bg-gray-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-evo-orange text-white text-xs font-bold px-3 py-1 rounded">
                      {product.badge}
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest border-2 border-white px-4 py-2">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-evo-orange mb-2 font-bold uppercase tracking-wider">{product.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-evo-orange transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg text-gray-300">RM{product.price}</span>
                    <span className="text-sm text-gray-500 group-hover:text-white transition-colors">View Details &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>
      {/* Bulk Inquiry Section */}
      <section className="bg-neutral-900/50 border-y border-white/5 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Researching for a team?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            We offer tiered volume discounts for institutional hubs and verified labs.
            Connect with our logistics team for a custom quote.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Evo Team, I'm interested in wholesale/bulk pricing for research purposes.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-8 py-3 bg-evo-dark border border-evo-orange text-evo-orange font-bold rounded hover:bg-evo-orange hover:text-white transition-all"
          >
            WHOLESALE INQUIRY
          </a>
        </div>
      </section>
    </div>
  );
};

export default Shop;