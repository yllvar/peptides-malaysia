import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../src/hooks/useProducts';
import { WHATSAPP_NUMBER } from '../src/constants';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('category') || 'All';
  const [filter, setFilter] = useState<string>(initialFilter);
  const categories = ['All', 'Weight Management', 'Recovery', 'Performance', 'Anti-Aging'];

  const { data: products, isLoading, error } = useProducts();

  const handleFilterChange = (cat: string) => {
    setFilter(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  if (isLoading) return <div className="pt-32 text-center text-white">Loading products...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">Error loading products.</div>;

  const validProducts = products || [];
  const filteredProducts = filter === 'All'
    ? validProducts
    : validProducts.filter(p => p.category === filter);

  return (
    <div className="bg-evo-black min-h-screen bg-sparkle">
      <SEO
        title="Shop The Evo™ Series | High-Purity Research Peptides"
        description="Browse our selection of laboratory-grade research peptides. Retatrutide, BPC-157/TB-500 Blends, GHK-Cu, and more. KL Ready Stock."
      />
      {/* Immersive Shop Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-evo-orange/10 to-transparent blur-3xl opacity-30 select-none pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase tracking-tighter italic">
              THE <span className="text-evo-orange drop-shadow-[0_0_15px_rgba(255,77,0,0.5)]">EVO™</span> SERIES
            </h1>
            <p className="text-gray-400 uppercase tracking-[0.3em] text-xs font-semibold max-w-2xl mx-auto leading-relaxed">
              Vanguard Research Isotopes & High-Purity Laboratory Solvents.
              <br className="hidden md:block" /> Engineered for biological precision.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        {/* Glass Filter Bar */}
        <div className="sticky top-24 z-40 mb-16 animate-fade-in delay-100">
          <div className="bg-evo-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 inline-flex flex-wrap justify-center gap-1 mx-auto shadow-2xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${filter === cat
                  ? 'bg-evo-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.4)]'
                  : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`group block animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-evo-gray/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-evo-orange/30 group-hover:bg-evo-gray/60 group-hover:shadow-[0_0_40px_rgba(255,77,0,0.1)]">

                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-transparent to-transparent opacity-60" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badge && (
                      <div className="bg-evo-orange text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-lg shadow-evo-orange/40">
                        {product.badge}
                      </div>
                    )}
                    {product.isNew && (
                      <div className="bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter border border-white/20">
                        NEW ARRIVAL
                      </div>
                    )}
                  </div>

                  {/* Out of Stock Overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-evo-black/80 flex items-center justify-center p-6 text-center">
                      <div className="border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full">
                        <span className="text-white text-sm font-black uppercase tracking-[0.2em]">Depleted</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Meta Info */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Status: Verified HPLC</p>
                    <p className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">Purity: {'>'}99.9%</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-evo-orange shadow-[0_0_8px_rgba(255,77,0,0.8)]" />
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{product.category}</div>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-evo-orange transition-colors tracking-tight">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">MSRP / Research Unit</p>
                      <span className="text-2xl font-bold text-white tracking-tighter">
                        {product.price > 0 ? `RM${product.price.toFixed(2)}` : 'TBA / INQUIRE'}
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl group-hover:bg-evo-orange group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-40 animate-fade-in">
            <div className="text-evo-orange mb-4 opacity-30">
              <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">SEQUENCE NOT FOUND</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Try selecting a different research category.</p>
          </div>
        )}
      </div>

      {/* Premium Bulk Inquiry */}
      <section className="mt-32 border-t border-white/5 bg-evo-dark/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-evo-orange/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 py-24 text-center relative">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tighter italic">
            INSTITUTIONAL <span className="text-evo-orange">ACQUISITION</span>
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-loose">
            We provide tiered physiological data sets and volume discounts for
            verified laboratory hubs and clinical research consortiums.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Evo Team, I'm interested in wholesale/bulk pricing for research purposes.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-10 py-4 bg-transparent border-2 border-evo-orange text-evo-orange font-black rounded-2xl hover:bg-evo-orange hover:text-white hover:shadow-[0_0_30px_rgba(255,77,0,0.3)] transition-all duration-500 uppercase tracking-widest text-[10px]"
          >
            Request Logistics Protocol
          </a>
        </div>
      </section>
    </div>

  );
};

export default Shop;