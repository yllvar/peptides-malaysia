import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS, WHATSAPP_NUMBER, COA_DATA } from '../constants';
import { CartItem } from '../types';
import { Check, AlertCircle, ShoppingCart, MessageCircle, FileText } from 'lucide-react';

interface ProductDetailProps {
  addToCart: (item: CartItem) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'desc' | 'guide' | 'coa'>('desc');

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return <div className="pt-32 text-center text-white">Product not found</div>;
  }

  const handleWhatsAppBuy = () => {
    const message = `Hi Peptides Malaysia, I would like to purchase the ${product.name} (RM${product.price}). Is it in stock?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-white">Home</Link> / <Link to="/shop" className="hover:text-white">Shop</Link> / <span className="text-evo-orange">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Section */}
          <div className="bg-neutral-900 border border-white/10 rounded-lg p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent"></div>
            <img src={product.image} alt={product.name} className="relative w-full max-w-md shadow-2xl rounded-md" />
          </div>

          {/* Info Section */}
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{product.name}</h1>
            <div className="text-2xl text-evo-orange font-bold mb-6">RM{product.price}</div>

            <div className="bg-white/5 border-l-4 border-evo-orange p-4 mb-8">
              <p className="text-sm text-gray-300 leading-relaxed">
                <span className="font-bold text-white">Research Kit Includes:</span> This SKU is sold as a bundled research unit containing the lyophilized peptide and 10ml of Evo™ Bacteriostatic Water. Components cannot be separated.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded border border-white/10 flex items-center justify-center transition-all"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> ADD TO CART
              </button>
              <button
                onClick={handleWhatsAppBuy}
                className="flex-1 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded flex items-center justify-center transition-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> BUY VIA WHATSAPP
              </button>
            </div>

            {/* Features List */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Specifications</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-300">
                    <Check className="h-4 w-4 text-evo-orange mr-2" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tabs */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex space-x-6 border-b border-white/10 mb-6">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 text-sm font-bold tracking-wide transition-colors border-b-2 ${activeTab === 'desc' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  DESCRIPTION
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`pb-3 text-sm font-bold tracking-wide transition-colors border-b-2 ${activeTab === 'guide' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  RECONSTITUTION
                </button>
                <button
                  onClick={() => setActiveTab('coa')}
                  className={`pb-3 text-sm font-bold tracking-wide transition-colors border-b-2 ${activeTab === 'coa' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  LAB DATA (COA)
                </button>
              </div>

              <div className="text-gray-400 text-sm leading-relaxed min-h-[200px]">
                {activeTab === 'desc' && (
                  <div className="animate-fade-in">
                    <p className="mb-4">{product.description}</p>
                    <p>Designed for in-vitro research use only. This product is strictly for laboratory handling by qualified professionals. Keep stored at -20°C for long-term stability.</p>
                  </div>
                )}
                {activeTab === 'guide' && (
                  <div className="animate-fade-in">
                    <div className="bg-neutral-900 p-4 rounded border border-white/10 mb-4">
                      <h4 className="text-white font-bold mb-2 flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-evo-orange" /> Important Protocol</h4>
                      <p>Slowly inject the BAC water down the side of the vial. Do not spray directly onto the lyophilized powder. Swirl gently; do not shake.</p>
                    </div>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Ensure all surfaces and vial tops are wiped with alcohol prep pads.</li>
                      <li>Equilibrate the vial to room temperature before reconstitution.</li>
                      <li>Once reconstituted, store in a refrigerator (2-8°C).</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'coa' && (
                  <div className="animate-fade-in">
                    {(() => {
                      const coa = COA_DATA.find(c => product.name.includes(c.productName) || c.productName.includes(product.name));
                      if (coa) {
                        return (
                          <div className="flex items-center justify-between p-4 bg-neutral-900 border border-white/10 rounded">
                            <div>
                              <div className="text-white font-bold">{coa.productName}</div>
                              <div className="text-xs text-gray-500">Batch: {coa.batchNumber} | Purity: {coa.purity}</div>
                            </div>
                            <Link to="/lab-testing" className="text-evo-orange hover:text-white flex items-center">
                              <FileText className="h-4 w-4 mr-1" /> View History
                            </Link>
                          </div>
                        );
                      }
                      return <p>Lab analysis for this batch is currently being processed. Contact support for early access.</p>;
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;