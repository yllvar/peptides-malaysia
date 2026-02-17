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
            EVO PEPTIDES: <br />
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
            <p className="text-gray-400 leading-relaxed mb-6 font-light">
              <span className="text-white font-bold italic uppercase">Peptides Malaysia</span> is the primary pulse for advanced biochemistry. We eliminate the reliance on erratic international shipping by providing elite, lab-verified compounds across the entire <span className="text-white font-bold italic">Malaysian Peninsula and Southeast Asian research corridor.</span>
            </p>
            <p className="text-gray-400 leading-relaxed font-light italic">
              Our products are engineered for those who demand surgical precision and maximum stability. We don't just supply; we provide the foundation for the most ambitious research protocols in the region.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-evo-orange/20 blur-3xl rounded-full"></div>
            <div className="relative bg-neutral-900 border border-white/10 p-8 rounded-lg overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-evo-orange/5 -translate-y-16 translate-x-16 rounded-full group-hover:bg-evo-orange/10 transition-all duration-700"></div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider relative z-10 italic">The Regional Blueprint</h3>
              <p className="text-sm text-gray-400 mb-6 relative z-10">Evo positions itself as a dominant high-performance hub for the elite Southeast Asian research community.</p>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center text-sm text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-evo-orange mr-3 shrink-0" /> <span className="uppercase tracking-widest font-bold text-[10px]">Verified Analytical Purity</span>
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Zap className="h-4 w-4 text-evo-orange mr-3 shrink-0" /> <span className="uppercase tracking-widest font-bold text-[10px]">Sporty-Noir Luxury Aesthetic</span>
                </li>
                <li className="flex items-center text-sm text-gray-300">
                  <Truck className="h-4 w-4 text-evo-orange mr-3 shrink-0" /> <span className="uppercase tracking-widest font-bold text-[10px]">Cross-Border Logistics Network</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coverage & Reach - NEW */}
        <div className="mb-32">
          <div className="bg-gradient-to-r from-evo-black to-neutral-900 border border-white/10 p-12 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-evo-orange/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-evo-orange/10 transition-all duration-1000"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8 italic uppercase tracking-tighter">
                BEYOND BORDERS: <br />
                <span className="text-evo-orange">THE PAN-ASIAN HUB.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light italic border-l-2 border-evo-orange pl-8 mb-12 max-w-3xl">
                While our Command Center is rooted in Kuala Lumpur, the Evo™ Series knows no boundaries. Peptides Malaysia is the primary pulse for advanced biochemistry from the northern reaches of <span className="text-white">Penang and Kelantan</span> to the southern gates of <span className="text-white">Johor</span>, spanning across the sea to <span className="text-white">Sabah, Sarawak, Brunei, and Singapore</span>. We have optimized our cold-chain logistics to ensure that whether you are in a lab in Georgetown or a facility in Bandar Seri Begawan, your Evo™ compounds arrive with surgical precision and peak integrity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { region: "Central Hub", cities: "KL, Perak, Kuantan", speed: "Same/Next Day" },
                  { region: "North & South", cities: "Penang, Johor, Melaka", speed: "1-2 Days" },
                  { region: "East Malaysia", cities: "Sabah & Sarawak", speed: "3-5 Days Air" },
                  { region: "Cross-Border", cities: "Singapore & Brunei", speed: "Institutional Freight" }
                ].map((item, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-evo-orange/30 transition-all">
                    <div className="text-[10px] font-black text-evo-orange uppercase tracking-widest mb-2">{item.region}</div>
                    <div className="text-white font-bold mb-3 italic">{item.cities}</div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-tighter font-medium">{item.speed}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Core Standards */}
        <div className="mb-32">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-12 text-center uppercase tracking-tighter italic">CORE RESEARCH STANDARDS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-evo-orange transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-widest">01. ELITE STABILITY</div>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">Evo peptides are vacuum-sealed in specialized amber or light-protected black vials to prevent UV degradation, critical for sensitive compounds.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-evo-orange transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-widest">02. EVO KIT LOGIC</div>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">We bundle our signature peptides with high-purity Evo Bacteriostatic (BAC) Water, ensuring immediate, stable reconstitution.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-evo-orange transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-evo-orange/5 -translate-y-12 translate-x-12 rounded-full group-hover:bg-evo-orange/10 transition-all"></div>
              <div className="text-evo-orange font-display font-bold text-xl mb-4 italic group-hover:translate-x-1 transition-transform relative z-10 tracking-widest">03. REGIONAL COMMAND</div>
              <p className="text-sm text-gray-400 leading-relaxed font-light relative z-10 italic">Utilizing hyper-local dispatch for Central regions and specialized Air Freight for East Malaysia and International hubs. Speed and discretion mirrored.</p>
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