import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck, FlaskConical, Flame, Activity, Dumbbell, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Home: React.FC = () => {
  const featuredProduct = PRODUCTS[0]; // Retatrutide Kit

  return (
    <div className="bg-evo-black overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center">
        {/* Luxurious Dark Background */}
        <div className="absolute inset-0 bg-neutral-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-transparent to-black/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-evo-orange/10 via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-evo-orange/30 bg-black/50 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(255,77,0,0.3)]">
            <span className="w-2 h-2 rounded-full bg-evo-orange mr-2 animate-pulse"></span>
            <span className="text-evo-orange text-xs font-bold tracking-[0.2em] uppercase">Malaysian Ready Stock</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-[0.9]">
            SPORTY <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">LUXURY.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-orange to-red-600">SCIENCE EVOLVED.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The exclusive gateway to Evo™ Laboratory Excellence. High-performance research peptides for the elite Malaysian scientific community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/shop"
              className="group relative px-8 py-4 bg-evo-orange hover:bg-evo-orangeHover text-white font-bold tracking-wide rounded overflow-hidden transition-all"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="flex items-center">SHOP COLLECTION <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold tracking-wide rounded backdrop-blur-sm transition-all"
            >
              OUR DNA
            </Link>
          </div>
        </div>
      </div>

      {/* Shop By Goal - Specific Request */}
      <section className="py-24 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">RESEARCH GOALS</h2>
            <div className="w-24 h-1 bg-evo-orange mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fat Loss */}
            <Link to="/shop" className="group relative bg-neutral-900 border border-white/5 rounded-xl p-8 hover:border-evo-orange/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-evo-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              <div className="bg-evo-black w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-evo-orange transition-colors shadow-lg">
                <Flame className="h-8 w-8 text-white group-hover:text-evo-orange transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">WEIGHT MANAGEMENT</h3>
              <p className="text-gray-500 text-sm mb-6">GLP-1 & GIP Agonists. Retatrutide, Tirzepatide, Semaglutide.</p>
              <span className="text-evo-orange text-sm font-bold flex items-center">BROWSE COMPOUNDS <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>

            {/* Recovery */}
            <Link to="/shop" className="group relative bg-neutral-900 border border-white/5 rounded-xl p-8 hover:border-evo-orange/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-evo-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              <div className="bg-evo-black w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-evo-orange transition-colors shadow-lg">
                <Activity className="h-8 w-8 text-white group-hover:text-evo-orange transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">RECOVERY & HEALING</h3>
              <p className="text-gray-500 text-sm mb-6">Tissue repair and inflammation modulation. BPC-157, TB-500.</p>
              <span className="text-evo-orange text-sm font-bold flex items-center">BROWSE COMPOUNDS <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>

            {/* Performance */}
            <Link to="/shop" className="group relative bg-neutral-900 border border-white/5 rounded-xl p-8 hover:border-evo-orange/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-evo-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              <div className="bg-evo-black w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-evo-orange transition-colors shadow-lg">
                <Dumbbell className="h-8 w-8 text-white group-hover:text-evo-orange transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">PERFORMANCE</h3>
              <p className="text-gray-500 text-sm mb-6">Growth Hormone Secretagogues. CJC-1295, Ipamorelin.</p>
              <span className="text-evo-orange text-sm font-bold flex items-center">BROWSE COMPOUNDS <ChevronRight className="h-4 w-4 ml-1" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Bundle */}
      <section className="py-24 bg-evo-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-evo-orange/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-evo-orange blur-[100px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
              <div className="relative border border-white/10 p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                <img
                  src={featuredProduct.image}
                  alt="Retatrutide Kit"
                  className="w-full rounded shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute top-6 right-6 bg-evo-orange text-white text-xs font-bold px-3 py-1 rounded shadow-lg animate-pulse">
                  BEST SELLER
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-evo-orange font-bold tracking-widest uppercase mb-4 text-sm">Evo™ Flagship Series</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Retatrutide 20mg + <br /> BAC Water Bundle</h3>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                The pinnacle of metabolic research. This exclusive Evo™ kit is designed for researchers who demand precision. Sold as a complete research unit to ensure protocol integrity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                  <ShieldCheck className="h-5 w-5 text-evo-orange mr-3" />
                  <span className="text-sm font-bold">&gt;99.9% Purity</span>
                </div>
                <div className="flex items-center text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                  <FlaskConical className="h-5 w-5 text-evo-orange mr-3" />
                  <span className="text-sm font-bold">Includes Solvent</span>
                </div>
                <div className="flex items-center text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                  <Truck className="h-5 w-5 text-evo-orange mr-3" />
                  <span className="text-sm font-bold">KL Next-Day</span>
                </div>
                <div className="flex items-center text-gray-300 bg-white/5 p-3 rounded border border-white/5">
                  <Zap className="h-5 w-5 text-evo-orange mr-3" />
                  <span className="text-sm font-bold">Triple Agonist</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-4xl font-display font-bold text-white">RM500</div>
                <Link to={`/product/${featuredProduct.id}`} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold hover:bg-evo-orange hover:text-white transition-colors rounded text-center">
                  VIEW SPECIFICATIONS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;