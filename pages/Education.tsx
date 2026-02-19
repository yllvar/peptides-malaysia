import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ThermometerSnowflake,
  Droplet,
  ShieldCheck,
  Zap,
  Syringe,
  Clock,
  AlertTriangle,
  ChevronRight,
  Info,
  Activity
} from 'lucide-react';

const Education: React.FC = () => {
  // Calculator State (Preserved from original Education page as it's highly functional)
  const [vialQty, setVialQty] = useState<number>(5); // mg
  const [bacWater, setBacWater] = useState<number>(2); // ml
  const [desiredDose, setDesiredDose] = useState<number>(0.25); // mg

  const concentration = vialQty / bacWater;
  const unitsToPull = ((desiredDose / concentration) * 100).toFixed(1);

  return (
    <div className="bg-evo-black min-h-screen text-white font-sans antialiased">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/reta-2.webp"
            alt="Retatrutide Kit Cinematic"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-evo-black/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="inline-block px-3 py-1 border border-evo-orange/30 text-evo-orange text-[9px] font-bold tracking-[0.4em] uppercase mb-4">Official Protocol v1.4</div>
          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tighter uppercase italic leading-[0.9]">
            TECHNICAL <br />
            <span className="text-gray-500 text-3xl md:text-6xl">PREPARATION</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light italic border-l-2 border-evo-orange pl-8">
            The definitive gateway to Evo™ Laboratory protocols. Engineered for the elite research community to ensure maximum peptide integrity.
          </p>
        </div>
      </section>

      {/* Critical Storage Alert */}
      <section className="bg-evo-orange py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-black">
            <ThermometerSnowflake size={48} strokeWidth={1.5} className="animate-pulse" />
            <div>
              <h3 className="text-2xl font-display font-bold uppercase italic leading-none mb-1">REFRIGERATE AFTER RECONSTITUTION</h3>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Maintain 2°C – 8°C at all times to preserve peptide stability.</p>
            </div>
          </div>
          <div className="bg-black text-white px-8 py-3 font-black text-xs uppercase tracking-[0.2em] rounded-full">
            Storage Critical
          </div>
        </div>
      </section>

      {/* Main Content Hub */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Side: Reconstitution Steps */}
          <div className="lg:col-span-7">
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 uppercase italic">RECONSTITUTION PROCESS</h2>
              <div className="w-24 h-1 bg-evo-orange rounded-full mb-6"></div>
              <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase italic">9-STEP ANALYTICAL PREPARATION PROTOCOL</p>
            </div>

            <div className="space-y-16">
              {[
                { n: "01", t: "Preparation", d: "Wash your hands thoroughly and prepare a clean, clinical workspace for assembly." },
                { n: "02", t: "Uncap", d: "Remove the plastic flip-top protective cap from the Retatrutide 20mg research vial." },
                { n: "03", t: "Sanitize", d: "Clean the rubber stoppers of both the peptide vial and the Bacteriostatic Water vial with clinical alcohol swabs." },
                { n: "04", t: "Withdrawal", d: "Draw exactly 2ml of Bacteriostatic Water into the syringe. Eliminate large air bubbles." },
                { n: "05", t: "Injection", d: "Carefully insert the needle into the Retatrutide vial, aiming for the inside wall of the glass." },
                { n: "06", t: "Slow Release", d: "Slowly depress the plunger. Let the water trickle down the glass to avoid damaging the delicate peptide structure." },
                { n: "07", t: "Dissolve", d: "Gently swirl the vial in a circular motion. DO NOT SHAKE. Wait until the liquid is completely clear." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-8 group">
                  <span className="text-4xl font-display font-bold text-evo-orange/20 italic group-hover:text-evo-orange transition-colors duration-500">{step.n}</span>
                  <div>
                    <h4 className="text-xl font-display font-bold text-white uppercase italic mb-2 tracking-wide">{step.t}</h4>
                    <p className="text-gray-400 font-light leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Calculator & Specs */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              {/* PRÄZISIONS CALCULATOR - Integrated into the new layout */}
              <div className="bg-[#0a0a0a] border border-evo-orange/20 p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-evo-orange/5 blur-[60px]"></div>

                <h2 className="text-2xl font-display font-bold text-white mb-8 border-l-2 border-evo-orange pl-6 uppercase tracking-widest italic text-sm">
                  PRÄZISIONS CALCULATOR
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="relative group">
                    <label className="block text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Vial Master Quantity (mg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={vialQty}
                        onChange={(e) => setVialQty(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 p-4 text-white focus:border-evo-orange/50 focus:outline-none font-mono text-xl"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-xs">mg</div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Solvent Dilution (ml)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bacWater}
                        onChange={(e) => setBacWater(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 p-4 text-white focus:border-evo-orange/50 focus:outline-none font-mono text-xl"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-xs">ml</div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Target Research Dose (mg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        value={desiredDose}
                        onChange={(e) => setDesiredDose(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 p-4 text-white focus:border-evo-orange/50 focus:outline-none font-mono text-xl"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-xs">mg</div>
                    </div>
                  </div>
                </div>

                <div className="bg-evo-orange p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-black font-black uppercase tracking-[0.3em] mb-2">Calculated Syringe Pull</span>
                  <div className="text-5xl font-display font-bold text-white tracking-tighter italic">
                    {unitsToPull} <span className="text-lg opacity-70 font-sans uppercase">IU</span>
                  </div>
                  <span className="mt-2 text-[8px] text-black/60 font-bold uppercase tracking-widest italic">Standard U-100 Insulin Syringe</span>
                </div>
              </div>

              {/* Verification Info */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-6">Verification Matrix</h4>
                <ul className="space-y-4">
                  {[
                    'HPLC Purity Analysis (>99.5%)',
                    'LC-MS Identity Confirmation',
                    'MALDI-TOF Mass Spectrometry'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-[9px] text-gray-500 font-bold tracking-widest uppercase italic">
                      <ShieldCheck className="h-3 w-3 text-evo-orange mr-3" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dosage Section */}
        <div className="mt-48 relative rounded-3xl overflow-hidden border border-white/10">
          <div className="absolute inset-0">
            <img src="/images/reta-3.webp" alt="Dosage Backdrop" className="w-full h-full object-cover opacity-20 blur-sm" />
            <div className="absolute inset-0 bg-evo-black/80"></div>
          </div>

          <div className="relative z-10 p-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 uppercase italic">RESEARCH DOSAGE SCHEDULE</h2>
              <p className="text-evo-orange font-mono text-xs tracking-widest uppercase italic font-bold">Protocol based on 2ml reconstitution volume</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Research Phase</th>
                    <th className="py-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Weekly Dose</th>
                    <th className="py-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Syringe Units (U-100)</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5">
                  {[
                    { phase: "Weeks 1 - 4", dose: "2 mg", units: "20 Units" },
                    { phase: "Weeks 5 - 8", dose: "4 mg", units: "40 Units" },
                    { phase: "Weeks 9 - 12", dose: "6 mg", units: "60 Units" },
                    { phase: "Weeks 13 - 16", dose: "9 mg", units: "90 Units" },
                    { phase: "Weeks 17+", dose: "12 mg", units: "120 Units" }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/10 transition-colors group">
                      <td className="py-8 px-4 font-display font-bold text-xl italic group-hover:text-evo-orange transition-colors">{row.phase}</td>
                      <td className="py-8 px-4 font-mono text-2xl tracking-tighter text-white">{row.dose}</td>
                      <td className="py-8 px-4 text-right">
                        <span className="bg-black border border-white/10 px-6 py-3 rounded-full font-black text-evo-orange text-lg tracking-widest italic shadow-xl">
                          {row.units}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Best Practices Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Syringe, title: "Injection Method", desc: "Subcutaneous (Sub-Q) injection into stomach, thigh, or upper arm." },
            { icon: Clock, title: "Rotation", desc: "Choose a different spot for each weekly injection to prevent skin irritation." },
            { icon: ShieldCheck, title: "Expiration", desc: "Use the reconstituted solution within 30 days for maximum integrity." },
            { icon: AlertTriangle, title: "Disclaimer", desc: "FOR RESEARCH USE ONLY. Not for human consumption or therapeutic use." }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-8 rounded-2xl hover:border-evo-orange/30 transition-all group">
              <item.icon className="h-10 w-10 text-evo-orange mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-display font-bold text-white uppercase italic mb-4 tracking-wider">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-48 flex flex-col items-center gap-12 text-center pb-24">
          <h3 className="text-5xl md:text-7xl font-display font-bold text-white uppercase italic leading-none tracking-tighter">
            READY TO <br /> <span className="text-gray-600">PROCEED?</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
            <Link to="/shop" className="flex-1 bg-evo-orange py-6 px-10 text-white font-black uppercase tracking-[0.2em] text-sm rounded-full hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-4 group">
              Shop Research Hub <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/lab-testing" className="flex-1 bg-black border border-white/10 py-6 px-10 text-white font-black uppercase tracking-[0.2em] text-sm rounded-full hover:border-evo-orange transition-all flex items-center justify-center gap-4 group">
              View Lab Logs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Education;