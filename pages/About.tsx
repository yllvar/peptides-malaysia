import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-evo-orange/10 mb-6">
            <Star className="h-8 w-8 text-evo-orange" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-none">
            PEPTIDES MALAYSIA: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-orange to-red-600 uppercase">The Vanguard Series.</span>
          </h1>
          <p className="text-xl text-gray-300 tracking-widest uppercase font-light">
            Redefining the local research landscape with <span className="text-evo-orange">Sporty-Noir Luxury</span>.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-evo-orange pl-4 uppercase tracking-tighter">THE MISSION</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              <span className="text-white font-bold">Peptides Malaysia</span> is the operational engine behind the <span className="text-evo-orange font-bold">Evo™ Series</span>. We are here to eliminate the reliance on questionable international shipping by providing elite, lab-verified compounds housed right here in <span className="text-white font-bold">Kuala Lumpur</span>.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our products are engineered for those who demand surgical precision and maximum stability. We don't just supply; we provide the foundation for the most ambitious research protocols in the country.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-evo-orange/20 blur-3xl rounded-full"></div>
            <div className="relative bg-neutral-900 border border-white/10 p-8 rounded-lg">
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider">The Evo™ Blueprint</h3>
              <p className="text-sm text-gray-400 mb-6">Unlike sterile medical brands, Evo positions itself as a high-performance brand for the elite research community.</p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-evo-orange mr-3" /> Evo-Grade Purity (HPLC/MS Verified)
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Zap className="h-4 w-4 text-evo-orange mr-3" /> Sporty-Noir Luxury Aesthetic
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Truck className="h-4 w-4 text-evo-orange mr-3" /> KL Ready Stock (Same-Day Hub)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Us */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-10 text-center uppercase tracking-widest">Core Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-all duration-300 group">
              <div className="text-evo-orange font-display font-bold text-xl mb-3 group-hover:translate-x-1 transition-transform">01. ELITE STABILITY</div>
              <p className="text-sm text-gray-400 leading-relaxed">Evo peptides are vacuum-sealed in specialized amber or light-protected black vials to prevent UV degradation, critical for sensitive compounds.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-all duration-300 group">
              <div className="text-evo-orange font-display font-bold text-xl mb-3 group-hover:translate-x-1 transition-transform">02. "EVO KIT" LOGIC</div>
              <p className="text-sm text-gray-400 leading-relaxed">We bundle our signature peptides with high-purity Evo Bacteriostatic (BAC) Water, ensuring immediate, stable reconstitution.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-all duration-300 group">
              <div className="text-evo-orange font-display font-bold text-xl mb-3 group-hover:translate-x-1 transition-transform">03. KL COMMAND CENTER</div>
              <p className="text-sm text-gray-400 leading-relaxed">Utilizing Lalamove and Grab for same-day delivery in Klang Valley. Speed and discretion mirroring high-performance expectations.</p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center border-t border-white/10 pt-16">
          <h2 className="text-4xl font-display font-bold text-white mb-6 uppercase">Vanguard of Research.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The Evo™ Series represents the bleeding edge of adipose and restorative research. Join the elite community redefining Malaysian biochemistry.
          </p>
          <div className="inline-block border border-evo-orange p-1 rounded transition-transform hover:scale-105 duration-300">
            <div className="bg-evo-orange/10 px-8 py-4">
              <span className="text-white font-bold tracking-[0.3em] uppercase">Evo™ — High Performance</span>
              <div className="text-xs text-evo-orange mt-2 uppercase tracking-widest font-bold">Precision. Stability. Authority.</div>
            </div>
          </div>
          <div className="mt-10">
            <Link to="/shop" className="inline-flex items-center text-white hover:text-evo-orange font-bold transition-colors group">
              EXPLORE THE COLLECTION <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;