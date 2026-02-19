import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ThermometerSnowflake,
  ShieldCheck,
  Zap,
  Syringe,
  Clock,
  AlertTriangle,
  ChevronRight,
  Info,
  Activity,
  FlaskConical,
  CheckCircle2,
  Layers,
  MoveRight
} from 'lucide-react';

const Education: React.FC = () => {
  // Calculator State - Calibrated for 20MG / 3ML Standard
  const [vialQty, setVialQty] = useState<number>(20); // mg
  const [bacWater, setBacWater] = useState<number>(3); // ml
  const [desiredDose, setDesiredDose] = useState<number>(2.0); // mg

  const concentration = vialQty / bacWater;
  const unitsToPull = ((desiredDose / concentration) * 100).toFixed(1);

  return (
    <div className="bg-evo-black min-h-screen text-white font-sans antialiased selection:bg-evo-orange selection:text-white">

      {/* HERO - Mobile Centric High Impact */}
      <section className="relative min-h-[85vh] flex flex-col justify-end pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/reta-2.webp"
            alt="Evo Technical"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-evo-black/80 to-evo-black/20"></div>
        </div>

        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="text-evo-orange text-[10px] font-bold tracking-[0.3em] uppercase">German Analytical Standards</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-bold mb-6 tracking-tighter uppercase italic leading-[0.85]">
            TECHNICAL <br />
            <span className="text-gray-500">PRÄZISION.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl max-w-xl leading-relaxed font-light italic border-l-2 border-evo-orange pl-6">
            Integrated Laboratory Protocols for the Evo™ Series. Derived from official German synthesis documentation.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-4 py-2 border border-white/5">
              <Activity size={12} className="text-evo-orange" /> BATCH-VERIFIED
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-4 py-2 border border-white/5">
              <Layers size={12} className="text-evo-orange" /> 99.8% PURITY
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION - Mobile Only Tabs */}
      <div className="sticky top-20 z-40 bg-evo-black/95 backdrop-blur-md border-y border-white/5 px-4 py-3 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap md:justify-center">
        {['Protocols', 'Titration', 'Calculator', 'Technique'].map((item) => (
          <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-evo-orange transition-colors px-2">
            {item}
          </button>
        ))}
      </div>

      {/* STORAGE ALERT - High Visibility */}
      <section className="bg-evo-orange px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <ThermometerSnowflake size={40} className="text-black shrink-0 animate-pulse" />
          <div className="text-black">
            <h3 className="text-lg font-display font-black uppercase italic leading-none mb-1">REFRIGERATION MANDATORY</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-80">Maintain 2°C – 8°C post-reconstitution.</p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">

        {/* 01 | PREPARATION CHECKLIST - Image Top for Mobile */}
        <section className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-display font-bold text-evo-orange/20 italic">01</span>
              <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-widest leading-none">PREPARATION</h2>
            </div>
            <p className="text-gray-400 text-sm font-light italic">Verify the presence of the Evo™ Preparation Suite before initializing.</p>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 group lg:aspect-[21/9]">
            <img src="/images/evo-education-1.webp" alt="Checklist" className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-evo-black/90 via-transparent to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { item: 'Retatrutide 20mg', info: 'Vial A-1' },
              { item: 'BAC Water 3ML', info: 'Solvent' },
              { item: 'U-100 Syringes', info: '2 Units' },
              { item: 'Clinical Swabs', info: '2 Units' }
            ].map((i, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-evo-orange/30 transition-all">
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{i.item}</p>
                  <p className="text-[9px] text-gray-500 uppercase mt-1 tracking-widest italic">{i.info}</p>
                </div>
                <CheckCircle2 className="text-evo-orange/20 group-hover:text-evo-orange transition-colors" size={20} />
              </div>
            ))}
          </div>
        </section>

        {/* 02 | STERILIZATION & SOLVENT TRANSFER */}
        <section className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-display font-bold text-evo-orange/20 italic">02</span>
              <h2 className="text-3xl font-display font-bold text-white uppercase italic tracking-widest leading-none">TRANSFER</h2>
            </div>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 group lg:aspect-[21/9] lg:order-last">
            <img src="/images/evo-education-3.webp" alt="Transfer" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-evo-black/90 via-transparent to-transparent"></div>
          </div>

          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {[
              { t: 'Uncapping', d: 'Remove protective plastic seals from both vials.' },
              { t: 'Aseptic Wipe', d: 'Sanitize both rubber stoppers with an alcohol swab.' },
              { t: 'Vacuum Release', d: 'Inject 3ML air into BAC water. Withdraw 3ML (300 Units) solvent.' },
              { t: 'Trickle Drip', d: 'Angle at 45°. Let solvent trickle down side walls to preserve peptide.' }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl group hover:border-evo-orange/50 transition-all">
                <span className="text-2xl font-display font-bold text-evo-orange">0{idx + 1}</span>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{step.t}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TITRATION SCHEDULE - Card Based for Mobile */}
        <section className="space-y-10">
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-5xl font-display font-bold text-white uppercase italic tracking-tighter">TITRATION <br /><span className="text-gray-500">SCHEDULE</span></h2>
            <p className="text-evo-orange font-mono text-[9px] font-bold uppercase tracking-[0.3em]">20MG Unit / 3ML Dilution / Once Weekly</p>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 group">
            <div className="absolute inset-0">
              <img src="/images/reta-3.webp" alt="Schedule" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-evo-black/80 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 p-8 flex flex-col gap-4">
              {[
                { w: 'W 1 - 4', d: '2.0 mg', u: '30 IU', n: 'METABOLIC ENTRY' },
                { w: 'W 5 - 8', d: '4.0 mg', u: '60 IU', n: 'STEADY STATE' },
                { w: 'W 9', d: '6.0 mg', u: '90 IU', n: 'ACTIVATION' },
                { w: 'W 10', d: '6.0 mg', u: '90 IU', n: 'VIAL 2 TRANSITION', highlight: true },
                { w: 'W 11 - 12', d: '6.0 mg', u: '90 IU', n: 'PLATEAU' }
              ].map((row, idx) => (
                <div key={idx} className={`flex items-center justify-between p-6 rounded-2xl border ${row.highlight ? 'bg-evo-orange/10 border-evo-orange' : 'bg-black/40 border-white/5'}`}>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{row.w}</p>
                    <p className="text-xl font-display font-black italic text-white">{row.n}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono text-evo-orange font-black leading-none">{row.u}</p>
                    <p className="text-[10px] text-white/40 uppercase mt-1 font-bold">{row.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRÄZISIONS CALCULATOR - Mobile Optimized Inputs */}
        <section className="bg-[#0a0a0a] border border-evo-orange/20 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-evo-orange/10 blur-[100px] pointer-events-none"></div>

          <div className="mb-12">
            <div className="inline-block px-3 py-1 bg-evo-orange text-black text-[9px] font-black uppercase tracking-[0.3em] mb-4">Laboratory Engine</div>
            <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter">DILUTION MATRIX</h2>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <div className="space-y-8">
              {[
                { label: 'Vial Master Weight', value: vialQty, setter: setVialQty, unit: 'MG' },
                { label: 'BAC Solvent Volume', value: bacWater, setter: setBacWater, unit: 'ML' },
                { label: 'Target Research Dose', value: desiredDose, setter: setDesiredDose, unit: 'MG', step: 0.1 }
              ].map((field, i) => (
                <div key={i} className="space-y-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{field.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      step={field.step || 1}
                      value={field.value}
                      onChange={(e) => field.setter(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 p-6 rounded-2xl text-4xl font-display italic font-black text-white focus:border-evo-orange/50 transition-all outline-none"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-xs font-bold">{field.unit}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-evo-orange py-10 px-8 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-[0_20px_60px_rgba(255,152,32,0.3)]">
              <p className="text-[11px] text-black font-black uppercase tracking-[0.4em] mb-4">Calculated Pull</p>
              <div className="text-8xl font-display font-black text-white italic tracking-tighter leading-none mb-2">
                {unitsToPull}
              </div>
              <p className="text-lg font-display font-bold text-black italic">UNITS / IU</p>
              <div className="h-px w-20 bg-black/20 my-6"></div>
              <p className="text-[9px] text-black font-black uppercase tracking-widest opacity-60">U-100 Graduated Syringe Standard</p>
            </div>
          </div>
        </section>

        {/* TECHNIQUE - Clean Cards */}
        <section className="space-y-12 pb-20">
          <div className="space-y-4">
            <h2 className="text-5xl font-display font-bold text-white uppercase italic tracking-tighter">ADMINISTRATION <br /><span className="text-gray-500">GEOMETRY</span></h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { t: 'Site Selection', d: '2 inches from the navel. Sanitize with fresh swabs.' },
              { t: 'The Pinch', d: 'Lift adipose tissue to isolate skin from muscle.' },
              { t: 'The Entry', d: 'Target 45° angle. Continuous steady injection.' },
              { t: 'Containment', d: 'Dispose in biological sharps container immediately.' }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-evo-orange/20 transition-all">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-evo-orange font-display font-bold italic">
                  0{i + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-[0.1em]">{s.t}</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 flex flex-col gap-6">
            <Link to="/shop" className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-evo-orange hover:text-white transition-all shadow-2xl group">
              Return to Research Hub <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex justify-center gap-8 opacity-20">
              <span className="text-[8px] font-mono whitespace-nowrap uppercase tracking-widest">MARGIN ±0.01%</span>
              <span className="text-[8px] font-mono whitespace-nowrap uppercase tracking-widest">DIN ISO 13485 COMPLIANT</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Education;