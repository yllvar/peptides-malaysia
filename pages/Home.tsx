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
              <img src="/images/evo-blob.png" alt="" className="w-full h-full object-contain blur-2xl" />
            </div>

            <img
              src="/images/evo-landing-header.png"
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
              <img src="/images/evo-gold-stroke.png" alt="" className="w-full h-auto object-contain opacity-100" />
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

      {/* EVO DNA Section - Refined Design */}
      <section className="bg-evo-black py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Constrained Impact Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl mb-12 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <img
              src="/images/evo-research.png"
              alt="Evo Research DNA"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 uppercase tracking-tighter italic">
              EVO DNA
            </h2>
            <div className="w-16 h-1 bg-evo-orange mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
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
                className="group bg-white rounded-xl p-4 flex items-center justify-between border-l-[4px] border-evo-orange hover:bg-gray-50 transition-all shadow-md"
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-display font-bold text-black leading-tight uppercase italic">{item.title}</h3>
                  <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 font-medium leading-tight">{item.desc}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-evo-orange transition-transform group-hover:translate-x-1" strokeWidth={3} />
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