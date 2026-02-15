import React, { useState } from 'react';
import { useBlogPosts } from '../src/hooks/useBlogPosts';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, FlaskConical } from 'lucide-react';

const Education: React.FC = () => {
  const { data: posts, isLoading } = useBlogPosts();

  // Calculator State
  const [vialQty, setVialQty] = useState<number>(5); // mg
  const [bacWater, setBacWater] = useState<number>(2); // ml
  const [desiredDose, setDesiredDose] = useState<number>(0.25); // mg

  // Calculate concentration: mg / ml
  const concentration = vialQty / bacWater;
  // Calculate units per mg (assuming standard insulin syringe 100 units = 1ml)
  const unitsToPull = ((desiredDose / concentration) * 100).toFixed(1);

  return (
    <div className="bg-evo-black min-h-screen">

      {/* Header: Cinematic Tech Entrance */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden border-b border-white/5">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        >
          <source src="/images/reta-vid-2.MOV" type="video/quicktime" />
          <source src="/images/reta-vid-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-evo-black via-transparent to-evo-black/80"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="text-evo-orange text-[9px] font-bold tracking-[0.3em] uppercase">German Analytical Standards</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tighter uppercase italic leading-none">
            TECHNICAL <br />
            <span className="text-gray-500">PRÄZISION.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light italic border-l-2 border-evo-orange pl-8">
            The definitive gateway to Evo™ Laboratory protocols. Engineered in Germany, batch-verified in Kuala Lumpur. Analytical integrity for the elite research community.
          </p>
        </div>

        {/* Technical Sidebar Indicator */}
        <div className="absolute right-10 bottom-10 hidden xl:block">
          <div className="flex flex-col items-end space-y-2 opacity-30">
            <span className="text-[10px] font-mono text-white uppercase tracking-widest">System Status: ANALYZED</span>
            <span className="text-[10px] font-mono text-white uppercase tracking-widest">Purity Grade: 99.85%</span>
            <span className="text-[10px] font-mono text-white uppercase tracking-widest">ISO 9001:2015 COMPLIANT</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Protocols & Standards */}
          <div className="lg:col-span-7 space-y-20">

            {/* Vanguard Protocols Section */}
            <div>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest italic">Vanguard Protocols</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-evo-orange to-transparent ml-8 opacity-20"></div>
              </div>

              {isLoading ? (
                <div className="text-white text-center py-10 font-mono text-xs opacity-50">INITIALIZING DATA STREAMS...</div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {(posts || []).map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="group relative bg-[#0a0a0a] border border-white/5 p-8 hover:border-evo-orange/50 transition-all duration-700 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FlaskConical className="h-20 w-20 text-white" />
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-[9px] font-bold text-evo-orange border border-evo-orange/30 px-2 py-0.5 tracking-widest uppercase">{post.category}</span>
                        <div className="h-px w-8 bg-white/10"></div>
                        <span className="text-[9px] text-gray-600 font-mono italic">REF: EVO-{post.id?.slice(0, 6).toUpperCase()}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight italic group-hover:translate-x-2 transition-transform">{post.title}</h3>
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed font-light line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center text-[10px] font-bold text-white uppercase tracking-[0.3em] group-hover:text-evo-orange transition-colors">
                        ENTER LOG <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* German Quality Assurance Section */}
            <div className="bg-gradient-to-br from-neutral-900 via-black to-black border border-white/10 p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 animate-data-stream bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100%_200%]"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-start gap-10 mb-12">
                  <div className="w-24 h-24 border border-evo-orange/30 flex items-center justify-center bg-evo-orange/5 shrink-0">
                    <span className="text-evo-orange font-display font-bold text-3xl">DE</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase italic">DAS REINHEITSGEBOT</h2>
                    <p className="text-gray-400 text-sm leading-relaxed font-light italic">
                      Derived from the historic German "Purity Law," the Evo Handling Standard enforces strict biophysical integrity. Our peptides are synthesized in state-of-the-art German facilities adhering to European Pharmacopoeia (Ph. Eur.) standards.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] border-b border-white/10 pb-4">Verification Matrix</h4>
                    <ul className="space-y-4">
                      {[
                        'HPLC Purity Analysis (>99.5%)',
                        'LC-MS Identity Confirmation',
                        'TFA / Counter-ion Removal',
                        'MALDI-TOF Mass Spectrometry'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center text-[10px] text-gray-500 font-bold tracking-widest uppercase italic">
                          <ShieldCheck className="h-3.5 w-3.5 text-evo-orange mr-3" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] border-b border-white/10 pb-4">Thermodynamics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Stability (-20°C)</span>
                        <span className="text-white font-mono text-sm tracking-tighter">60 Months</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Stability (2-8°C)</span>
                        <span className="text-white font-mono text-sm tracking-tighter">24 Months</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[10px] text-evo-orange font-bold uppercase tracking-widest italic">Post-Reconstitution</span>
                        <span className="text-evo-orange font-mono text-sm tracking-tighter font-bold">30 Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculator Hub */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="bg-[#0a0a0a] border border-evo-orange/20 p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-evo-orange/5 blur-[60px]"></div>

                <h2 className="text-2xl font-display font-bold text-white mb-10 border-l-2 border-evo-orange pl-6 uppercase tracking-widest italic">
                  PRÄZISIONS CALCULATOR
                </h2>

                <div className="space-y-8 mb-12">
                  <div className="relative group">
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 group-hover:text-evo-orange transition-colors">Vial Master Quantity (mg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={vialQty}
                        onChange={(e) => setVialQty(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 rounded-none p-5 text-white focus:border-evo-orange/50 focus:outline-none transition-all font-mono text-2xl tracking-tighter"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-sm uppercase">mg</div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 group-hover:text-evo-orange transition-colors">Solvent Dilution (ml)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bacWater}
                        onChange={(e) => setBacWater(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 rounded-none p-5 text-white focus:border-evo-orange/50 focus:outline-none transition-all font-mono text-2xl tracking-tighter"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-sm uppercase">ml</div>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 group-hover:text-evo-orange transition-colors">Target Research Dose (mg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        value={desiredDose}
                        onChange={(e) => setDesiredDose(Number(e.target.value))}
                        className="w-full bg-black border border-white/5 rounded-none p-5 text-white focus:border-evo-orange/50 focus:outline-none transition-all font-mono text-2xl tracking-tighter"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 font-mono text-sm uppercase">mg</div>
                    </div>
                  </div>
                </div>

                {/* The Output Engine */}
                <div className="bg-evo-orange p-8 flex flex-col items-center justify-center text-center relative group cursor-crosshair">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[10px] text-black font-black uppercase tracking-[0.4em] mb-4">Calculated Syringe Pull</span>
                  <div className="text-6xl font-display font-bold text-white tracking-tighter italic overflow-hidden">
                    {unitsToPull} <span className="text-xl opacity-70 font-sans uppercase">IU</span>
                  </div>
                  <div className="mt-4 h-px w-20 bg-white/30"></div>
                  <span className="mt-4 text-[9px] text-black/60 font-bold uppercase tracking-widest italic">Standard U-100 Insulin Syringe</span>
                </div>

                <div className="mt-8 text-center">
                  <span className="text-[9px] text-gray-600 font-mono flex items-center justify-center gap-2">
                    <Activity className="h-3 w-3" /> ANALYTICAL PRECISION: ±0.01%
                  </span>
                </div>
              </div>

              {/* Sidebar Product Visual using the 1st MOV asset loop */}
              <div className="bg-[#0a0a0a] border border-white/5 p-4 relative aspect-video overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                >
                  <source src="/images/reta-vid-1.MOV" type="video/quicktime" />
                  <source src="/images/reta-vid-1.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="relative z-10 flex items-end h-full">
                  <span className="text-[10px] text-white font-bold tracking-[0.5em] uppercase p-4">RETA VIAL-A1 / B22</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Master Specification Table */}
        <div className="mt-32">
          <div className="flex flex-col items-center mb-16">
            <div className="inline-block px-4 py-1 border border-white/10 text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Master Technical Repository</div>
            <h2 className="text-4xl font-display font-bold text-white uppercase italic tracking-tighter">TECHNICAL MASTER SPECIFICATIONS</h2>
            <div className="mt-4 h-1 w-24 bg-evo-orange"></div>
          </div>

          <div className="bg-neutral-900 border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Product ID</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Research Domain</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Molecular Formula</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Molar Mass</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Mechanism</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Purity Grade</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-light">
                  {[
                    { name: 'EVO-RETA-10', cat: 'Metabolic / Triple-G', formula: 'C221H342N54O67', mass: '4731.33 g/mol', focus: 'GCGR/GIPR/GLP-1R', grade: '99.8%' },
                    { name: 'EVO-BPC-157', cat: 'Angiogenesis / Recovery', formula: 'C62H98N16O22', mass: '1419.5 g/mol', focus: 'Soft Tissue Repair', grade: '99.9%' },
                    { name: 'EVO-TB-500', cat: 'Actin T4 / Cellular', formula: 'C212H350N56O78S', mass: '4963.5 g/mol', focus: 'Cell Migration', grade: '99.7%' },
                    { name: 'EVO-MT2-HP', cat: 'Melanocortin / UV', formula: 'C50H69N11O9', mass: '1024.2 g/mol', focus: 'MC4R Agonism', grade: '99.8%' },
                    { name: 'EVO-CJC-1295', cat: 'Pituitary / GH', formula: 'C165H271N47O46', mass: '3647.2 g/mol', focus: 'GHRH Agonist', grade: '99.8%' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                      <td className="p-6 text-white font-bold italic tracking-tighter group-hover:text-evo-orange transition-colors">{row.name}</td>
                      <td className="p-6 text-gray-400 uppercase tracking-tighter italic">{row.cat}</td>
                      <td className="p-6 text-gray-500 font-mono tracking-tighter">{row.formula}</td>
                      <td className="p-6 text-gray-300 font-mono">{row.mass}</td>
                      <td className="p-6 text-white font-bold opacity-70 group-hover:opacity-100">{row.focus}</td>
                      <td className="p-6 text-evo-orange font-bold font-mono group-hover:scale-110 origin-left transition-transform">{row.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] italic">
            <span>* BATCH VERIFICATION REQUIRED FOR FULL HPLC LOGS</span>
            <span>GERMAN SPECIFICATION COMPLIANT: DIN ISO 13485</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;