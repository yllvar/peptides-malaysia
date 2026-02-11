import React, { useState } from 'react';
import { BLOG_POSTS } from '../constants';
import { Link } from 'react-router-dom';

const Education: React.FC = () => {
  // Calculator State
  const [vialQty, setVialQty] = useState<number>(5); // mg
  const [bacWater, setBacWater] = useState<number>(2); // ml
  
  // Calculate concentration: mg / ml
  const concentration = (vialQty / bacWater).toFixed(2);
  // Calculate units per mg (assuming standard insulin syringe 100 units = 1ml)
  // If user wants 0.5mg dose
  const [desiredDose, setDesiredDose] = useState<number>(0.25); // mg
  const unitsToPull = ((desiredDose / (vialQty / bacWater)) * 100).toFixed(1);

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">EDUCATION HUB</h1>
          <p className="text-gray-400 max-w-2xl">
            Protocols, safety guidelines, and tools for the modern researcher.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content: Blog */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-white border-l-4 border-evo-orange pl-4">Latest Protocols</h2>
            {BLOG_POSTS.map(post => (
              <div key={post.id} className="bg-neutral-900 border border-white/10 p-6 rounded-lg hover:border-evo-orange/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-evo-orange uppercase tracking-wider">{post.category}</span>
                  <span className="text-xs text-gray-500">{post.date} • {post.readTime}</span>
                </div>
                <Link to={`/blog/${post.id}`}>
                    <h3 className="text-2xl font-bold text-white mb-3 hover:text-evo-orange cursor-pointer transition-colors">{post.title}</h3>
                </Link>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="text-sm font-bold text-white underline decoration-evo-orange hover:no-underline">
                    Read Protocol
                </Link>
              </div>
            ))}
          </div>

          {/* Sidebar: Calculator */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-800 border border-white/10 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-6 bg-evo-orange mr-3"></span>
                Peptide Calculator
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Vial Quantity (mg)</label>
                  <input 
                    type="number" 
                    value={vialQty} 
                    onChange={(e) => setVialQty(Number(e.target.value))}
                    className="w-full bg-black border border-white/20 rounded p-2 text-white focus:border-evo-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">BAC Water Added (ml)</label>
                  <input 
                    type="number" 
                    value={bacWater} 
                    onChange={(e) => setBacWater(Number(e.target.value))}
                    className="w-full bg-black border border-white/20 rounded p-2 text-white focus:border-evo-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded mb-6 text-center border border-white/5">
                <div className="text-xs text-gray-500 uppercase">Concentration</div>
                <div className="text-2xl font-bold text-white">{concentration} <span className="text-sm text-gray-400">mg/ml</span></div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Desired Research Dose (mg)</label>
                <div className="flex gap-2 mb-4">
                    <input 
                      type="number" 
                      step="0.05"
                      value={desiredDose} 
                      onChange={(e) => setDesiredDose(Number(e.target.value))}
                      className="w-full bg-black border border-white/20 rounded p-2 text-white focus:border-evo-orange focus:outline-none"
                    />
                </div>
                
                <div className="bg-evo-orange p-4 rounded text-center shadow-lg shadow-evo-orange/20">
                  <div className="text-xs text-black/70 font-bold uppercase mb-1">Pull Syringe To</div>
                  <div className="text-3xl font-bold text-white">{unitsToPull} <span className="text-sm">Units (IU)</span></div>
                  <div className="text-[10px] text-white/80 mt-1">*Assuming U-100 Insulin Syringe</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Education;