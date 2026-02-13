import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck, FlaskConical, Flame, Activity, Dumbbell, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../src/constants';

const Home: React.FC = () => {
  const featuredProduct = PRODUCTS[0]; // Retatrutide Kit

  return (
    <div className="bg-evo-black overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-evo-orange/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow delay-100 mix-blend-screen"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center z-10">
        <div className="text-center px-4 max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-evo-orange/30 bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(255,77,0,0.3)] mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-evo-orange mr-2 animate-pulse"></span>
            <span className="text-evo-orange text-xs font-bold tracking-[0.2em] uppercase">Malaysian Ready Stock</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-9xl font-display font-bold text-white mb-6 tracking-tight leading-[0.9] animate-fade-in-up delay-100">
            SPORTY <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">LUXURY.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-orange to-red-600">SCIENCE EVOLVED.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200">
            The exclusive gateway to Evo™ Laboratory Excellence. High-performance research peptides for the elite Malaysian scientific community.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up delay-300">
            <Link
              to="/shop"
              className="group relative px-10 py-5 bg-evo-orange hover:bg-evo-orangeHover text-white font-bold tracking-wide rounded overflow-hidden transition-all shadow-[0_0_20px_rgba(255,77,0,0.4)] hover:shadow-[0_0_40px_rgba(255,77,0,0.6)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="flex items-center">SHOP COLLECTION <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link
              to="/about"
              className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold tracking-wide rounded backdrop-blur-sm transition-all hover:border-white/30"
            >
              OUR DNA
            </Link>
          </div>
        </div>
      </div>

      {/* Shop By Goal - Enhanced Cards */}
      <section className="py-32 bg-neutral-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-white mb-6">RESEARCH PROTOCOLS</h2>
            <div className="w-24 h-1 bg-evo-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'WEIGHT MANAGEMENT', icon: Flame, desc: 'GLP-1 & GIP Agonists. Retatrutide, Tirzepatide, Semaglutide.', gradient: 'from-orange-500/20' },
              { title: 'RECOVERY & HEALING', icon: Activity, desc: 'Tissue repair and inflammation modulation. BPC-157, TB-500.', gradient: 'from-blue-500/20' },
              { title: 'PERFORMANCE', icon: Dumbbell, desc: 'Growth Hormone Secretagogues. CJC-1295, Ipamorelin.', gradient: 'from-purple-500/20' }
            ].map((item, idx) => (
              <Link key={idx} to="/shop" className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-10 hover:border-evo-orange/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className="bg-evo-black w-20 h-20 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:border-evo-orange transition-colors shadow-lg group-hover:scale-110 duration-500">
                    <item.icon className="h-10 w-10 text-white group-hover:text-evo-orange transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-wide">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed h-12">{item.desc}</p>
                  <span className="text-evo-orange text-sm font-bold flex items-center tracking-wider group-hover:translate-x-2 transition-transform">
                    BROWSE COMPOUNDS <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bundle - Floating Animation */}
      <section className="py-32 bg-evo-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-evo-orange/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Image Side */}
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-evo-orange blur-[120px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700 animate-pulse-slow"></div>
              <div className="relative animate-float">
                <div className="border border-white/10 p-4 rounded-xl bg-white/5 backdrop-blur-md transform rotate-[-2deg] transition-transform group-hover:rotate-0 duration-700">
                  <img
                    src={featuredProduct.image}
                    alt="Retatrutide Kit"
                    className="w-full rounded shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                {/* Floating Badges */}
                <div className="absolute -top-6 -right-6 bg-evo-orange text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(255,77,0,0.4)] animate-bounce delay-700">
                  BEST SELLER
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2">
              <h2 className="text-evo-orange font-bold tracking-[0.3em] uppercase mb-4 text-sm">Evo™ Flagship Series</h2>
              <h3 className="text-5xl md:text-6xl font-display font-bold text-white mb-8 leading-none">
                Retatrutide 20mg <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">BAC Water Bundle</span>
              </h3>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg border-l-4 border-evo-orange pl-6">
                The pinnacle of metabolic research. This exclusive Evo™ kit is designed for researchers who demand precision. Sold as a complete research unit to ensure protocol integrity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {[
                  { icon: ShieldCheck, text: '>99.9% Purity' },
                  { icon: FlaskConical, text: 'Includes Solvent' },
                  { icon: Truck, text: 'KL Next-Day' },
                  { icon: Zap, text: 'Triple Agonist' }
                ].map((tag, i) => (
                  <div key={i} className="flex items-center text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                    <tag.icon className="h-5 w-5 text-evo-orange mr-3" />
                    <span className="text-sm font-bold">{tag.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-5xl font-display font-bold text-white">RM{featuredProduct.price}</div>
                <Link to={`/product/${featuredProduct.id}`} className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold hover:bg-evo-orange hover:text-white transition-all rounded text-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)]">
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