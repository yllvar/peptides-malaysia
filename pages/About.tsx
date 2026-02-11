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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-evo-orange to-red-600">REDEFINING THE PEAK.</span>
          </h1>
          <p className="text-xl text-gray-300 tracking-wide uppercase font-light">
            The Exclusive Gateway to Evo™ Laboratory Excellence.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-evo-orange pl-4">OUR MISSION</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              At <span className="text-white font-bold">Peptides Malaysia</span>, we don't just supply research materials; we fuel the evolution of Malaysian science. Our mission is singular: to establish <span className="text-white font-bold">Evo™</span> as the gold standard in the Malaysian peptide market.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We recognized a gap in the local landscape—researchers were forced to choose between overpriced imports or questionable local quality. We founded Peptides Malaysia to bridge that gap, delivering Evo™—a brand synonymous with surgical precision, luxurious branding, and uncompromising purity.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-evo-orange/20 blur-3xl rounded-full"></div>
            <div className="relative bg-neutral-900 border border-white/10 p-8 rounded-lg">
              <h3 className="text-white font-bold mb-4">The Evo™ Philosophy</h3>
              <p className="text-sm text-gray-400 mb-6">Evo isn’t just a brand name; it’s a commitment to progressive performance. While others look at the current state of biochemistry, we look at what’s next.</p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-evo-orange mr-3" /> Elite Purity (&gt;99% HPLC)
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Zap className="h-4 w-4 text-evo-orange mr-3" /> Sporty Innovation
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Truck className="h-4 w-4 text-evo-orange mr-3" /> Vacuum-Sealed Engineering
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Us */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-10 text-center">WHY PEPTIDES MALAYSIA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-colors">
              <div className="text-evo-orange font-display font-bold text-xl mb-3">01. MALAYSIAN READY STOCK</div>
              <p className="text-sm text-gray-400">No more waiting weeks for international customs. Our inventory is housed right here in KL, ready for immediate dispatch.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-colors">
              <div className="text-evo-orange font-display font-bold text-xl mb-3">02. THE BLACK & ORANGE STANDARD</div>
              <p className="text-sm text-gray-400">We represent the "Luxurious Sporty" side of science. Our brand reflects the energy, drive, and ambition of the elite Malaysian research community.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded hover:border-evo-orange transition-colors">
              <div className="text-evo-orange font-display font-bold text-xl mb-3">03. UNRIVALED SUPPORT</div>
              <p className="text-sm text-gray-400">In a market often clouded by anonymity, we stand tall. Our dedicated WhatsApp support ensures professional, localized expertise.</p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center border-t border-white/10 pt-16">
          <h2 className="text-4xl font-display font-bold text-white mb-6">JOIN THE EVOLUTION.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Whether you are exploring the cutting-edge metabolic pathways of Retatrutide or the restorative potential of our healing line, do it with the best.
          </p>
          <div className="inline-block border border-evo-orange p-1 rounded">
            <div className="bg-evo-orange/10 px-8 py-4">
              <span className="text-white font-bold tracking-widest uppercase">Peptides Malaysia & Evo™</span>
              <div className="text-xs text-evo-orange mt-2">Precision in every drop. Performance in every vial.</div>
            </div>
          </div>
          <div className="mt-10">
            <Link to="/shop" className="inline-flex items-center text-white hover:text-evo-orange font-bold transition-colors">
              START YOUR RESEARCH <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;