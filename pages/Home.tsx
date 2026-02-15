import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck, FlaskConical, Flame, Activity, Dumbbell, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../src/constants';

const Home: React.FC = () => {
  const featuredProduct = PRODUCTS[0]; // Retatrutide Kit

  return (
    <div className="bg-evo-black overflow-hidden relative">


      {/* Hero Section - Simplified Evo-Noir Implementation */}
      <section className="relative h-screen min-h-[700px] flex items-center z-10">
        {/* Stable Background Asset */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/evo-header-bg.png"
            alt="Evo Peptides Laboratory Excellence"
            className="w-full h-full object-cover"
          />
          {/* Subtle bottom fade to blend with next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-evo-black to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-20 pb-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-evo-orange/20 bg-black/60 backdrop-blur-md mb-6 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-evo-orange mr-2 animate-pulse shadow-[0_0_8px_#ff4d00]"></span>
              <span className="text-white text-[9px] font-bold tracking-[0.2em] uppercase">Malaysian Ready Stock</span>
            </div>

            {/* Headline - Scaled down for harmony */}
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-[0.9] animate-fade-in-up delay-100 uppercase italic">
              SPORTY <span className="text-gray-500">LUXURY.</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-orange to-red-600">SCIENCE EVOLVED.</span>
            </h1>

            {/* Subtext - Compact and balanced */}
            <p className="text-base md:text-lg text-gray-400 mb-10 max-w-lg leading-relaxed font-light animate-fade-in-up delay-200 italic border-l border-white/10 pl-5">
              The exclusive gateway to Evo™ Laboratory Excellence. <br className="hidden md:block" />
              High-performance research peptides for the elite scientific community.
            </p>

            {/* Buttons - Sized for balance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-300">
              <Link
                to="/shop"
                className="group relative px-8 py-3.5 bg-evo-orange hover:bg-evo-orangeHover text-white font-bold tracking-widest rounded transition-all shadow-[0_10px_30px_rgba(255,77,0,0.3)] hover:scale-105"
              >
                <span className="flex items-center text-xs uppercase">SHOP COLLECTION <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold tracking-widest rounded backdrop-blur-sm transition-all text-xs uppercase"
              >
                OUR DNA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Goal - Enhanced Cards */}
      <section className="py-32 bg-neutral-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-white mb-6">RESEARCH PROTOCOLS</h2>
            <div className="w-24 h-1 bg-evo-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'WEIGHT MANAGEMENT', icon: Flame, desc: 'GLP-1 & GIP Agonists. Retatrutide, Tirzepatide, Semaglutide.', gradient: 'from-evo-orange/10' },
              { title: 'RECOVERY & HEALING', icon: Activity, desc: 'Tissue repair and inflammation modulation. BPC-157, TB-500.', gradient: 'from-white/5' },
              { title: 'PERFORMANCE', icon: Dumbbell, desc: 'Growth Hormone Secretagogues. CJC-1295, Ipamorelin.', gradient: 'from-evo-orange/5' }
            ].map((item, idx) => (
              <Link key={idx} to="/shop" className="group relative bg-neutral-900 border border-white/5 rounded-sm p-12 hover:border-evo-orange transition-all duration-700 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center mb-10 border-l border-evo-orange pl-4">
                    <item.icon className="h-8 w-8 text-white group-hover:text-evo-orange transition-colors" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 font-display tracking-tight uppercase italic leading-none">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-10 leading-relaxed font-light">{item.desc}</p>
                  <span className="text-white text-[10px] font-bold flex items-center tracking-[0.3em] uppercase group-hover:text-evo-orange transition-colors">
                    EXPLORE <ChevronRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
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
            <div className="order-2 lg:order-1 relative group flex justify-center">
              <div className="absolute inset-0 bg-evo-orange blur-[150px] opacity-10 rounded-full animate-pulse-slow"></div>

              <div className="relative z-10 flex items-end gap-x-0 animate-float translate-y-10 scale-110">
                {/* Vial Stack logic again for consistency */}
                <div className="w-28 -mr-6 -mb-4 transform -rotate-6 grayscale contrast-125 z-0 opacity-50">
                  <img src={featuredProduct.image} alt="Vial Left" className="w-full" />
                </div>
                <div className="w-40 z-20">
                  <img src={featuredProduct.image} alt="Main Vial" className="w-full drop-shadow-[0_30px_60px_rgba(255,100,0,0.4)]" />
                </div>
                <div className="w-28 -ml-6 -mb-4 transform rotate-6 grayscale contrast-125 z-10 opacity-50">
                  <img src={featuredProduct.image} alt="Vial Right" className="w-full" />
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 border border-evo-orange/30 text-evo-orange text-[10px] font-bold tracking-[0.3em] uppercase mb-8">FLAGSHIP SERIES</div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-none italic uppercase">
                RETATRUTIDE <br />
                <span className="text-gray-600">RESEARCH KIT</span>
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg border-l-2 border-evo-orange pl-8 font-light italic">
                The pinnacle of metabolic research. This exclusive Evo™ kit is engineered for those who demand precision. Sold as a complete research unit to ensure protocol integrity and structural stability.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-12">
                {[
                  { icon: ShieldCheck, text: '99.9% PURITY' },
                  { icon: FlaskConical, text: 'SOLVENT INCL.' },
                  { icon: Truck, text: 'KL HUB READY' },
                  { icon: Zap, text: 'TRIPLE-G AGON.' }
                ].map((tag, i) => (
                  <div key={i} className="flex items-center text-white bg-white/5 p-4 border border-white/5 hover:border-evo-orange/30 transition-colors">
                    <tag.icon className="h-4 w-4 text-evo-orange mr-4" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{tag.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-10">
                <div className="text-5xl font-display font-bold text-white italic">RM{featuredProduct.price}</div>
                <Link to={`/product/${featuredProduct.id}`} className="group w-full sm:w-auto px-12 py-5 bg-white text-black font-bold hover:bg-evo-orange hover:text-white transition-all text-center uppercase tracking-widest text-xs">
                  ANALYSIS DATA <ChevronRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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