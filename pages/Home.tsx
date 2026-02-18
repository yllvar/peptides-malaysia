import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Truck, FlaskConical, Flame, Activity, Dumbbell, ChevronRight, Clock } from 'lucide-react';
import { PRODUCTS } from '../src/constants';

const Home: React.FC = () => {
  const featuredProduct = PRODUCTS[0]; // Retatrutide Kit
  const [timeLeft, setTimeLeft] = React.useState(1621); // 27:01 in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 1621));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-evo-black overflow-hidden relative">


      {/* Hero Section - Simplified Evo-Noir Implementation */}
      {/* Mobile-First Hero Section */}
      <div className="bg-evo-lime text-black font-bold py-2 px-4 flex items-center justify-between text-xs md:text-sm uppercase tracking-wider relative z-40 mt-20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇲🇾</span>
          <div className="bg-red-500 text-white rounded-full p-0.5"><Clock size={12} /></div>
          <span>Limited Stock!</span>
        </div>
        <div className="font-mono text-lg tracking-widest font-black bg-black text-white px-2 rounded">
          {formatTime(timeLeft)}
        </div>
      </div>

      <section className="relative bg-gradient-to-b from-[#1a0b2e] via-black to-black pt-12 pb-24 px-4 overflow-hidden z-0">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-2 leading-[0.9] uppercase italic tracking-tighter">
            Sporty Luxury <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-lime to-white">Science Evolved.</span>
          </h1>

          {/* Main Product Image (3 Bottles) - Static */}
          <div className="relative w-full max-w-sm md:max-w-md mx-auto mb-4 mt-4">
            {/* Background Blob - Positioned behind the product bottles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-60 pointer-events-none z-0">
              <img src="/images/evo-blob.webp" alt="" className="w-full h-full object-contain blur-2xl" />
            </div>

            <img
              src="/images/evo-landing-header.webp"
              alt="Evo Peptides Research Kit"
              className="relative z-10 w-full h-auto drop-shadow-[0_0_50px_rgba(193,255,114,0.3)]"
            />
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto font-light px-4">
            The exclusive gateway to Evo™ Laboratory Excellence.<br className="hidden md:block" />
            High-performance research peptides for the elite scientific community.
          </p>

          <div className="relative flex flex-col gap-4 max-w-xs mx-auto w-full z-20">
            {/* Gold Stroke positioned behind buttons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-auto pointer-events-none -z-10">
              <img src="/images/evo-gold-stroke.webp" alt="" className="w-full h-auto object-contain opacity-100" />
            </div>

            <button
              onClick={() => window.location.href = '/shop'}
              className="w-full py-4 bg-evo-lime text-black font-black text-lg rounded-full uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(193,255,114,0.4)]"
            >
              Add to Cart
            </button>
            <Link
              to="/about"
              className="w-full py-4 bg-white text-black font-black text-lg rounded-full uppercase tracking-widest hover:bg-gray-200 hover:scale-105 transition-all text-center"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase - Logo Display */}
      <section className="bg-evo-black py-16 flex justify-center items-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-evo-lime/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-2xl px-8">
          <img
            src="/logo/reta-logo.webp"
            alt="Evo Peptides Branding"
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(193,255,114,0.15)] opacity-90"
          />
        </div>
      </section>

      {/* CTA Banner Separator */}
      <Link to="/shop" className="block bg-evo-lime py-10 relative overflow-hidden group border-y border-black/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16">
          <div className="flex items-center gap-4">
            <Zap size={32} fill="black" className="animate-pulse" />
            <span className="text-black font-black text-2xl md:text-4xl italic uppercase tracking-tighter leading-none text-center md:text-left">
              Join the Elite <br className="md:hidden" /> Research Community
            </span>
          </div>

          <div className="flex items-center gap-3 bg-black text-white px-12 py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl group-hover:bg-evo-orange transition-all group-hover:scale-110 group-active:scale-95">
            Shop Now <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-full bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
      </Link>

      {/* EVO DNA Section - Restored High-Impact Design */}
      <section className="bg-evo-black relative z-10">
        {/* Full Width Impact Image */}
        <div className="w-full h-[400px] md:h-[600px] overflow-hidden">
          <img
            src="/images/evo-dna.webp"
            alt="Evo Research DNA"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Protocols Listing */}
        <div className="bg-[#0a0a1a] py-12 px-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-display font-bold text-white text-center mb-10 uppercase tracking-tighter italic">
              EVO DNA
            </h2>

            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'WEIGHT MANAGEMENT',
                  desc: 'Optimal weight with triple-agonist precision for lasting results.',
                  path: '/shop'
                },
                {
                  title: 'RECOVERY & HEALING',
                  desc: 'Accelerate muscle repair and speed healing to get you back faster.',
                  path: '/shop'
                },
                {
                  title: 'PERFORMANCE',
                  desc: 'Boost energy metabolism to elevate output for superior athletic results.',
                  path: '/shop'
                }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="group bg-white rounded-2xl p-5 flex items-center justify-between border-l-[6px] border-evo-orange hover:scale-[1.02] transition-transform shadow-lg"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-display font-bold text-black leading-tight uppercase italic">{item.title}</h3>
                    <p className="text-gray-600 text-xs mt-1 font-medium leading-snug">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-10 w-10 text-evo-orange transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Separator */}
      <Link to="/shop" className="block bg-evo-lime py-10 relative overflow-hidden group border-y border-black/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16">
          <div className="flex items-center gap-4">
            <ShieldCheck size={32} fill="black" className="animate-pulse" />
            <span className="text-black font-black text-2xl md:text-3xl italic uppercase tracking-tighter leading-none text-center md:text-left">
              HPLC VERIFIED PURITY <br className="md:hidden" /> FOR ELITE RESULTS
            </span>
          </div>

          <div className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl group-hover:bg-evo-orange transition-all group-hover:scale-110 group-active:scale-95">
            ACCESS LAB DATA <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Research Kit Section - Refined Design */}
      <section className="py-24 bg-evo-black border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Image Side - Centered Spotlight (TOP on mobile) */}
            <div className="order-1 lg:order-1 relative py-12 flex justify-center items-center">
              {/* Local Spotlight */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square bg-evo-orange/20 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>

              <div className="relative z-10 w-full max-w-md px-10">
                <img
                  src="/images/evo-research-kit.webp"
                  alt="Evo Research Kit"
                  className="w-full h-auto drop-shadow-[0_0_100px_rgba(255,77,0,0.3)] transition-transform hover:scale-105 duration-1000"
                />
              </div>
            </div>

            {/* Text Side (BOTTOM on mobile) */}
            <div className="order-2 lg:order-2 space-y-8">
              <div>
                <div className="inline-block px-3 py-1 border border-evo-orange/30 text-evo-orange text-[10px] font-bold tracking-[0.3em] uppercase mb-4 rounded-sm">FLAGSHIP SERIES</div>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-none italic uppercase">
                  RETATRUTIDE <br />
                  <span className="text-gray-500">RESEARCH KIT</span>
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-evo-orange"></div>
                <p className="text-gray-400 leading-relaxed text-lg pl-8 font-light italic">
                  The pinnacle of metabolic research. This exclusive Evo™ kit is engineered for those who demand precision. Sold as a complete research unit to ensure protocol integrity and structural stability.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, text: '99.9% PURITY' },
                  { icon: FlaskConical, text: 'SOLVENT INCL.' },
                  { icon: Truck, text: 'KL HUB READY' },
                  { icon: Zap, text: 'TRIPLE-G AGON.' }
                ].map((tag, i) => (
                  <div key={i} className="flex items-center text-white bg-white/5 p-3 border border-white/5 hover:border-evo-orange/20 transition-all rounded-sm group/tag">
                    <tag.icon className="h-3.5 w-3.5 text-evo-orange mr-4 group-hover/tag:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold tracking-widest uppercase">{tag.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 pt-4">
                <div className="text-5xl font-display font-bold text-white italic tracking-tighter">RM{featuredProduct.price}</div>
                <Link to={`/product/${featuredProduct.id}`} className="group w-full sm:w-auto px-12 py-5 bg-white text-black font-black hover:bg-evo-orange hover:text-white transition-all text-center uppercase tracking-widest text-xs rounded-full">
                  ANALYSIS DATA <ChevronRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Guidance Preview Section - NEW */}
      <section className="py-24 bg-gradient-to-b from-evo-black to-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Text Side */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-block px-3 py-1 bg-evo-lime/10 border border-evo-lime/20 text-evo-lime text-[10px] font-bold tracking-[0.3em] uppercase mb-4 rounded-sm">Protocol v1.4</div>
                <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-[0.9] italic uppercase">
                  TECHNICAL <br />
                  <span className="text-gray-500 text-3xl md:text-5xl">PREPARATION</span>
                </h2>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed font-light italic border-l-2 border-evo-lime pl-8">
                Master the precision of Retatrutide 20mg unit reconstitution. Ensure maximum peptide integrity through our validated 9-step laboratory protocol.
              </p>

              <div className="space-y-4">
                {[
                  'Validated Solution Clarity',
                  'Optimized Storage Parameters',
                  'Syringe Unit Titration'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-widest italic group">
                    <div className="w-1.5 h-1.5 bg-evo-lime rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/guidance/retatrutide-20mg"
                className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-evo-lime transition-all group shadow-2xl"
              >
                View Full Protocol <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image Side - Teaser */}
            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-10 bg-evo-lime/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 rounded-2xl border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(193,255,114,0.1)] group">
                <img
                  src="/images/evo-education-1.webp"
                  alt="Protocol Preparation Preview"
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
                  <span className="text-[120px] md:text-[180px] font-display font-black text-evo-orange/20 italic tracking-tighter leading-none select-none">EVO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;