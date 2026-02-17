import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-evo-orange/5 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-block p-4 rounded-full bg-evo-orange/5 border border-evo-orange/10 mb-8 relative group">
            <div className="absolute inset-0 bg-evo-orange animate-pulse opacity-20 blur-xl rounded-full scale-125 group-hover:opacity-40 transition-opacity"></div>
            <ShieldCheck className="h-10 w-10 text-evo-orange relative z-10" />
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-[0.85] italic tracking-tighter uppercase">
            EVO™ PEPTIDES: <br />
            <span className="text-gray-500">THE VANGUARD SERIES.</span>
          </h1>
          <h3 className="text-xl md:text-3xl font-display font-bold text-evo-orange tracking-[0.2em] uppercase italic mb-8">
            German Precision. Pan-Asian Authority.
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-evo-orange to-transparent mx-auto"></div>
        </div>

        {/* Mission */}
        <div className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-2xl font-display font-bold text-white border-l-4 border-evo-orange pl-6 uppercase tracking-widest italic">THE MISSION</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-light italic">
              <span className="text-white font-bold uppercase not-italic">Evo™ Peptides</span> is the operational engine bringing world-class German biochemistry to Southeast Asia. We have eliminated the uncertainty of international transit by housing <span className="text-evo-orange font-bold">Germany’s elite, lab-verified compounds</span> right here in our regional hubs.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed font-light italic">
              Engineered in Germany and curated in Kuala Lumpur, our products are built for researchers who demand surgical precision. We don’t just supply chemicals; we provide the <span className="text-white font-bold">German-engineered foundation</span> for the most ambitious research protocols in Malaysia, Singapore, and Brunei.
            </p>
          </div>
          <div className="relative">
            {/* German Engineered Seal Placeholder/Illustration */}
            <div className="relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl overflow-hidden group hover:border-evo-orange/30 transition-all duration-700">
              <div className="absolute top-0 right-0 w-40 h-40 bg-evo-orange/10 -translate-y-20 translate-x-20 rounded-full blur-3xl group-hover:bg-evo-orange/20 transition-all"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-black border border-evo-orange/50 rounded-xl shadow-[0_0_20px_rgba(255,77,0,0.2)]">
                  <span className="text-evo-orange font-black text-xs tracking-tighter">DE</span>
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-lg uppercase italic tracking-widest">THE EVO™ BLUEPRINT</h3>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">European Standard Synthesis</div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed italic">
                Unlike generic medical brands, Evo™ is a high-performance lineage for the elite research community. We bridge the gap between European laboratory standards and Southeast Asian logistics.
              </p>

              <ul className="space-y-6">
                {[
                  { icon: ShieldCheck, t: "German-Synthesized Purity", d: "HPLC/MS Verified at source (>99.9% Purity)." },
                  { icon: Zap, t: "Sporty-Noir Luxury", d: "A premium aesthetic for high-performance research." },
                  { icon: Truck, t: "Regional Ready Stock", d: "Localized hubs for rapid, tax-paid delivery." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 group/item">
                    <item.icon className="h-5 w-5 text-evo-orange shrink-0 group-hover/item:scale-110 transition-transform" />
                    <div>
                      <div className="text-white text-xs font-black uppercase tracking-widest mb-1">{item.t}</div>
                      <div className="text-[11px] text-gray-500 font-medium italic">{item.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Core Standards */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase italic tracking-tighter">CORE STANDARDS</h2>
            <p className="text-[10px] text-gray-500 font-black tracking-[0.4em] uppercase">Engineered Authority</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl hover:border-evo-orange/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-[0.1em]">01. THE GERMAN SEAL</div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 opacity-70 italic">Elite Stability</h4>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">
                Every Evo™ peptide is synthesized in Germany and vacuum-sealed in specialized, light-protected black vials. This German-standard packaging prevents UV degradation and thermal fluctuation, ensuring the compound remains stable from the EU lab to your facility.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl hover:border-evo-orange/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-[0.1em]">02. "EVO KIT" LOGIC</div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 opacity-70 italic">Protocol Integrity</h4>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">
                To maintain German purity standards, we do not leave reconstitution to chance. We bundle our signature peptides with high-purity <span className="text-white font-bold">Evo™ Bacteriostatic (BAC) Water</span>, ensuring a stable, sterile environment for your research compounds.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl hover:border-evo-orange/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-[0.1em]">03. LOGISTICS COMMAND</div>
              <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 opacity-70 italic">Pan-Asian Reach</h4>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">
                Headquartered in Kuala Lumpur, our network spans **Penang, Kelantan, Kuantan, Perak, Johor, Singapore, Sabah, Sarawak, and Brunei**. We utilize Lalamove, Grab, and specialized air freight to ensure German quality arrives with local speed.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Logistics Section - NEW */}
        <div className="mb-32">
          <h3 className="text-xl font-display font-bold text-white mb-10 uppercase tracking-tighter italic border-b border-white/10 pb-4">LOGISTICS & REGIONAL FAQ</h3>
          <div className="space-y-6">
            {[
              {
                q: "What is your coverage area?",
                a: "Peptides Malaysia operates a high-speed logistics network covering every corner of the region: Central Hub (KL, Selangor, Perak, Kuantan) for Same/Next-day delivery; Northern & Southern Corridors for 1–2 day dispatch; and specialized Air Freight for East Malaysia (Sabah & Sarawak), Brunei, and Singapore to ensure peak peptide stability."
              },
              {
                q: "How do you ensure integrity during cross-border shipping?",
                a: "All Evo™ compounds are vacuum-sealed and housed in specialized UV-protected vials. For East Malaysia, Brunei, and Singapore, we utilize cold-chain optimized lanes designed to withstand pressure changes and transit times without compromising structural integrity."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-2xl group">
                <h4 className="text-evo-orange font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-evo-orange rounded-full"></span>
                  {faq.q}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed font-light italic pl-4.5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing / Vanguard Section */}
        <div className="text-center py-20 border-t border-white/5 relative bg-gradient-to-b from-transparent to-evo-orange/5 rounded-b-[4rem]">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 uppercase italic tracking-tighter">VANGUARD OF BIOCHEMISTRY.</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light italic text-lg">
            The <span className="text-white font-bold italic">Evo™ Series</span> represents the bleeding edge of German adipose and restorative research. By importing the finest European synthesis technology into the regional markets, we are redefining the Southeast Asian biochemistry landscape.
          </p>

          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-evo-orange blur opacity-25 group-hover:opacity-50 transition-opacity rounded-full"></div>
            <div className="relative bg-black border border-evo-orange/50 px-12 py-8 rounded-2xl text-center">
              <div className="text-white font-display font-bold text-xl tracking-[0.3em] uppercase italic mb-2">
                Evo™ — Engineered in Germany. <br />
                <span className="text-evo-orange">Mastered in Malaysia.</span>
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-black">Precision. Stability. Authority.</div>
            </div>
          </div>

          <div className="mt-16">
            <Link to="/shop" className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-evo-orange hover:text-white transition-all group shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              EXPLORE THE EVO™ COLLECTION <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;