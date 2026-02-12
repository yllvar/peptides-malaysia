import React, { useState } from 'react';
import { useBlogPosts } from '../src/hooks/useBlogPosts';
import { Link } from 'react-router-dom';

const Education: React.FC = () => {
  const { data: posts, isLoading } = useBlogPosts();

  // Calculator State
  const [vialQty, setVialQty] = useState<number>(5); // mg
  const [bacWater, setBacWater] = useState<number>(2); // ml

  // Calculate concentration: mg / ml
  const concentration = (vialQty / bacWater).toFixed(2);
  // Calculate units per mg (assuming standard insulin syringe 100 units = 1ml)
  const [desiredDose, setDesiredDose] = useState<number>(0.25); // mg
  const unitsToPull = ((desiredDose / (vialQty / bacWater)) * 100).toFixed(1);

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">TECHNICAL CENTER</h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Analytical protocols, precision calculators, and the <span className="text-evo-orange font-bold italic">Evo Standard</span> for professional laboratory handling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content: Blog */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-white border-l-4 border-evo-orange pl-4 uppercase tracking-widest mb-8 text-sm">Vanguard Protocols</h2>

            {isLoading ? (
              <div className="text-white text-center py-10">Loading protocols...</div>
            ) : (
              <div className="space-y-6">
                {(posts || []).map(post => (
                  <div key={post.id} className="bg-neutral-900 border border-white/10 p-8 rounded-lg group hover:border-evo-orange/50 transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-evo-orange uppercase tracking-[0.2em] bg-evo-orange/10 px-2 py-1 rounded">{post.category}</span>
                      <span className="text-[10px] text-gray-500 font-mono italic">{post.date}</span>
                    </div>
                    <Link to={`/blog/${post.id}`}>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-evo-orange transition-colors uppercase tracking-tight">{post.title}</h3>
                    </Link>
                    <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed text-sm">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest border-b border-evo-orange pb-1 hover:border-white transition-colors">
                      Enter Laboratory Log
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Evo Handling Standard Section */}
            <div className="mt-16 bg-gradient-to-br from-neutral-900 to-black border border-white/10 p-8 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-8xl font-display font-bold text-white">EVO</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter relative z-10">THE EVO HANDLING HUB</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                  <h4 className="text-evo-orange font-bold text-xs uppercase tracking-widest mb-3">Reconstitution Logic</h4>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 italic">
                    Structural integrity is sacrificed when reconstitution is rushed.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-start"><span className="text-evo-orange mr-2">▪</span> Use <strong>Evo™ BAC Water</strong> exclusively.</li>
                    <li className="flex items-start"><span className="text-evo-orange mr-2">▪</span> Inject solvent down the vial wall; avoid direct spray.</li>
                    <li className="flex items-start"><span className="text-evo-orange mr-2">▪</span> Swirl with zero-shear technique. <strong>Never Shake.</strong></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-evo-orange font-bold text-xs uppercase tracking-widest mb-3">Thermodynamics</h4>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li className="flex justify-between border-b border-white/5 pb-1">
                      <span>Frozen (-20°C)</span>
                      <span className="text-white">Up to 60 Months</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-1">
                      <span>Refrigerated (2°C-8°C)</span>
                      <span className="text-white">24 Months</span>
                    </li>
                    <li className="flex justify-between border-b border-white/5 pb-1">
                      <span>Post-Mixing Stability</span>
                      <span className="text-white font-bold text-evo-orange">30 Days (Refrigerated)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Calculator */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-evo-orange/20 p-8 rounded-lg sticky top-24 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-8 flex items-center uppercase tracking-tighter">
                <span className="w-1 h-6 bg-evo-orange mr-4"></span>
                PRECISION CALCULATOR
              </h2>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vial Content (mg)</label>
                  <input
                    type="number"
                    value={vialQty}
                    onChange={(e) => setVialQty(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-md p-3 text-white focus:border-evo-orange focus:outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Solvent Volume (ml)</label>
                  <input
                    type="number"
                    value={bacWater}
                    onChange={(e) => setBacWater(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-md p-3 text-white focus:border-evo-orange focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="bg-black/80 p-5 rounded-md mb-8 text-center border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Concentration</div>
                <div className="text-3xl font-display font-bold text-white">{concentration} <span className="text-sm text-gray-500 font-sans">mg/ml</span></div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Target Research Dose (mg)</label>
                <div className="flex gap-2 mb-6">
                  <input
                    type="number"
                    step="0.05"
                    value={desiredDose}
                    onChange={(e) => setDesiredDose(Number(e.target.value))}
                    className="w-full bg-black border border-white/10 rounded-md p-3 text-white focus:border-evo-orange focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="bg-evo-orange p-6 rounded-md text-center shadow-[0_0_30px_rgba(255,102,0,0.15)] group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <div className="text-[10px] text-black font-black uppercase tracking-[0.2em] mb-2 opacity-80">Calculated Syringe Pull</div>
                  <div className="text-4xl font-display font-bold text-white tracking-tighter">{unitsToPull} <span className="text-lg opacity-80 font-sans">IU</span></div>
                  <div className="text-[10px] text-black font-bold mt-2 opacity-60 uppercase tracking-widest">Standard U-100 Syringe</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Technical Master Specification Table */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tighter">TECHNICAL MASTER SPECIFICATION</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest italic">BATCH-VERIFIED HPLC DATA / EVO PURITY GUARANTEE ({'>'}99%)</p>
          </div>
          <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Name</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Molecular Formula</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Molar Mass</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Research Focus</th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Half-Life</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { name: 'Evo Retatrutide', cat: 'Weight / Metabolic', formula: 'C221H342N54O67', mass: '4731.33 g/mol', focus: 'Triple-G Agonism', hl: '~6 Days' },
                  { name: 'Evo BPC-157', cat: 'Healing / Recovery', formula: 'C62H98N16O22', mass: '1419.5 g/mol', focus: 'Angiogenesis', hl: '~4-6 Hours' },
                  { name: 'Evo TB-500', cat: 'Tissue Repair', formula: 'C212H350N56O78S', mass: '4963.5 g/mol', focus: 'Cellular Migration', hl: '~7-10 Days' },
                  { name: 'Evo Melanotan II', cat: 'UV / Pigmentation', formula: 'C50H69N11O9', mass: '1024.2 g/mol', focus: 'MC4R Agonism', hl: '~2-3 Hours' },
                  { name: 'Evo CJC-1295', cat: 'GH Performance', formula: 'C165H271N47O46', mass: '3647.2 g/mol', focus: 'Pituitary GH', hl: '~30 Min' }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold">{row.name}</td>
                    <td className="p-4 text-gray-400">{row.cat}</td>
                    <td className="p-4 text-gray-500 font-mono tracking-tighter">{row.formula}</td>
                    <td className="p-4 text-gray-300">{row.mass}</td>
                    <td className="p-4 text-evo-orange font-bold uppercase tracking-tighter">{row.focus}</td>
                    <td className="p-4 text-gray-300">{row.hl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[10px] text-gray-600 italic text-center uppercase tracking-widest">
            *This data is for laboratory research purposes only and adheres to Evo Standard environmental protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Education;