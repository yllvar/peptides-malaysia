import React from 'react';
import { COA_DATA, WHATSAPP_NUMBER } from '../src/constants';
import { FileText, ShieldCheck } from 'lucide-react';

const LabTesting: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ShieldCheck className="h-16 w-16 text-evo-orange mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Evo™ Grade Purity</h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every batch undergoes rigorous <span className="text-white font-bold">HPLC (High-Performance Liquid Chromatography)</span> and <span className="text-white font-bold">MS (Mass Spectrometry)</span> testing. Lab-verified purity is a non-negotiable standard for the Evo™ brand.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-white/5 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
            <div className="col-span-2 sm:col-span-1">Product</div>
            <div className="hidden sm:block">Batch #</div>
            <div className="hidden sm:block">Purity</div>
            <div className="col-span-2 sm:col-span-1 text-right">Document</div>
          </div>

          {COA_DATA.map((coa) => (
            <div key={coa.id} className="grid grid-cols-4 p-6 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-2 sm:col-span-1">
                <div className="text-white font-bold">{coa.productName}</div>
                <div className="text-xs text-gray-500 sm:hidden">Batch: {coa.batchNumber}</div>
              </div>
              <div className="hidden sm:block text-gray-300 font-mono text-sm">{coa.batchNumber}</div>
              <div className="hidden sm:block text-evo-orange font-bold">{coa.purity}</div>
              <div className="col-span-2 sm:col-span-1 text-right">
                <button
                  onClick={() => {
                    const msg = `Hi Evo Peptides, I'm researching ${coa.productName} (Batch: ${coa.batchNumber}). Could you please share the full PDF HPLC/Mass-Spec report?`;
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="underline">Request PDF</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabTesting;