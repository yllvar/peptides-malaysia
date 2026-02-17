import React from 'react';
import { COA_DATA, WHATSAPP_NUMBER } from '../src/constants';
import { FileText, ShieldCheck, Database, Globe, Zap } from 'lucide-react';

const LabTesting: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen relative overflow-hidden">
      {/* Background HUD elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-evo-orange/50"></div>
            <div className="text-evo-orange font-black text-[10px] tracking-[0.5em] uppercase">Authenticity Verified</div>
            <div className="w-12 h-[1px] bg-evo-orange/50"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase italic tracking-tighter">
            LABORATORY <span className="text-evo-orange">TRANSPARENCY</span> LEDGER
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed font-light italic text-lg mb-8">
            Every vial in the <span className="text-white font-bold">Evo™ Series</span> carries a unique batch identifier, linking it directly to its <span className="text-white border-b border-evo-orange/30 group-hover:border-evo-orange transition-colors">German synthesis origin</span>.
          </p>

          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-evo-orange" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">ISO 9001:2015 Compliant</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-evo-orange" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">EU Synthesis Standard</span>
            </div>
          </div>
        </div>

        {/* The Ledger Table */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-24">
          <div className="grid grid-cols-5 md:grid-cols-6 bg-black/40 p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-b border-white/10 italic">
            <div className="col-span-2 md:col-span-2">Research Compound</div>
            <div className="hidden md:block">Synthesis ID</div>
            <div className="hidden md:block">Status</div>
            <div className="">Purity</div>
            <div className="text-right">Dossier</div>
          </div>

          <div className="divide-y divide-white/5">
            {COA_DATA.map((coa) => (
              <div key={coa.id} className="grid grid-cols-5 md:grid-cols-6 p-8 items-center hover:bg-evo-orange/5 transition-all group">
                <div className="col-span-2 md:col-span-2">
                  <div className="text-white font-display font-bold text-lg tracking-tight group-hover:text-evo-orange transition-colors">{coa.productName}</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 md:hidden">ID: {coa.batchNumber}</div>
                </div>

                <div className="hidden md:block text-gray-400 font-mono text-xs uppercase tracking-tighter">
                  {coa.batchNumber}
                </div>

                <div className="hidden md:block">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black bg-evo-orange/10 text-evo-orange uppercase tracking-tighter border border-evo-orange/20">
                    Verified
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="text-white font-black text-lg tracking-tighter">{coa.purity}</div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">HPLC Analyzed</div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      const msg = `🚀 *EVO™ DOSSIER REQUEST*
*Compound:* ${coa.productName}
*Synthesis ID:* ${coa.batchNumber}

_Please provide the full HPLC/Mass-Spec analytical report for this batch._`;
                      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:border-evo-orange hover:bg-evo-orange/20 transition-all uppercase tracking-widest"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Request PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Logistics HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 p-10 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-evo-orange/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-white font-display font-bold text-xl mb-6 uppercase italic tracking-[0.1em]">Verified Dispatch Routes</h3>
            <ul className="space-y-6">
              {[
                { r: "Kuala Lumpur Center", d: "Batch-checked / Lalamove & Grab Ready", s: "Instant" },
                { r: "Penang, Johor, Kuantan", d: "J&T Priority Insured Tracking", s: "48H" },
                { r: "Singapore / Brunei", d: "Evo-Guard™ Thermal Air-Freight", s: "Express" }
              ].map((route, i) => (
                <li key={i} className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0">
                  <div>
                    <div className="text-evo-orange text-[10px] font-black uppercase tracking-widest mb-1">{route.r}</div>
                    <div className="text-gray-400 text-xs font-light italic">{route.d}</div>
                  </div>
                  <div className="text-white font-bold text-[10px] uppercase tracking-tighter">{route.s}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-evo-orange/5 border border-evo-orange/20 p-10 rounded-3xl flex flex-col justify-center text-center relative overflow-hidden">
            <Zap className="h-12 w-12 text-evo-orange mx-auto mb-6 opacity-50" />
            <h3 className="text-white font-display font-bold text-2xl mb-4 uppercase italic tracking-tighter">The Evo-Seal Guarantee</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light italic mb-8 px-4">
              "If it isn't Evo™, it hasn't been tested to this level. Our German partners synthesize the purity; our KL Command Center ensures its delivery. Do not settle for unverified research."
            </p>
            <div className="mt-auto pt-6 border-t border-evo-orange/10">
              <div className="text-evo-orange font-black text-[10px] tracking-[0.4em] uppercase">Engineered in Germany</div>
              <div className="text-white font-bold text-[10px] tracking-[0.2em] uppercase mt-1">Mastered in Malaysia</div>
            </div>
          </div>
        </div>

        {/* Technical Footer Note */}
        <div className="text-center text-gray-600 text-[10px] font-medium uppercase tracking-[0.3em] italic">
          Data Integrity Protocol v4.2 // All Rights Reserved EVO SERIES™
        </div>
      </div>
    </div>
  );
};

export default LabTesting;