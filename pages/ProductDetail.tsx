import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../src/hooks/useProducts';
import { useCartStore } from '../src/stores/cartStore';
import { WHATSAPP_NUMBER, STORAGE_PROTOCOLS } from '../src/constants';
import { Check, AlertCircle, ShoppingCart, MessageCircle, FileText, Activity, CheckCircle2, ChevronRight } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'desc' | 'guide' | 'coa' | 'tech'>('desc');
  const [showAdded, setShowAdded] = useState(false);

  const { data: products, isLoading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);

  const product = products?.find(p => p.id === id);
  const techSpec = product?.techSpec;

  if (isLoading) {
    return <div className="pt-32 text-center text-white">Loading product details...</div>;
  }

  if (!product) {
    return <div className="pt-32 text-center text-white">Product not found</div>;
  }

  const handleWhatsAppBuy = () => {
    const priceText = product.price > 0 ? `RM${product.price.toFixed(2)}` : 'TBA';

    const message = `🚀 *NEW EVO™ RESEARCH ORDER*
*Product:* ${product.name}
*Quantity:* 1 Kit
*Total Amount:* ${priceText}

*Customer Details:*
* Name: 
* Location: [City/State - e.g. Penang / JB / Kuching / Singapore]
* Shipping Preference: [Standard J&T / Same-Day Lalamove / International Air]

*Payment Status:* [Pending / Receipt Attached]
_I have read and accepted the Research Use Only terms for the Evo™ Series._`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 uppercase tracking-widest">
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
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-tight">{product.name}</h1>
            <div className="text-2xl text-evo-orange font-bold mb-6">
              {product.price > 0 ? `RM${product.price.toFixed(2)}` : 'TBA / INQUIRE'}
            </div>

            <div className="bg-white/5 border-l-4 border-evo-orange p-4 mb-8">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                <span className="font-bold text-white uppercase not-italic">Research Kit Logic:</span> Bundled research unit containing the lyophilized peptide and 3ml of Evo™ Bacteriostatic Water. Optimized for structural stability.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-bold rounded border flex items-center justify-center transition-all ${showAdded
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border-white/10'
                  }`}
              >
                {showAdded ? (
                  <><CheckCircle2 className="mr-2 h-5 w-5" /> ADDED TO CART!</>
                ) : (
                  <><ShoppingCart className="mr-2 h-5 w-5" /> ADD TO CART</>
                )}
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
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Core Specifications</h3>
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
              <div className="flex space-x-6 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 text-xs font-bold tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'desc' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  DESCRIPTION
                </button>
                <button
                  onClick={() => setActiveTab('tech')}
                  className={`pb-3 text-xs font-bold tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'tech' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  TECHNICAL DATA
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`pb-3 text-xs font-bold tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'guide' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  HANDLING
                </button>
                <button
                  onClick={() => setActiveTab('coa')}
                  className={`pb-3 text-xs font-bold tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'coa' ? 'text-white border-evo-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                  LAB DATA (COA)
                </button>
              </div>

              <div className="text-gray-400 text-sm leading-relaxed min-h-[220px]">
                {activeTab === 'desc' && (
                  <div className="animate-fade-in">
                    <p className="mb-4">{product.description}</p>
                    <p className="border-t border-white/5 pt-4 text-xs italic">Designed for in-vitro research use only. This product is strictly for laboratory handling by qualified professionals.</p>
                  </div>
                )}
                {activeTab === 'tech' && (
                  <div className="animate-fade-in">
                    {techSpec ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded">
                          <div className="text-[10px] uppercase text-gray-500 mb-1">Molar Mass</div>
                          <div className="text-white font-bold">{techSpec.mass}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded">
                          <div className="text-[10px] uppercase text-gray-500 mb-1">Half-Life</div>
                          <div className="text-white font-bold">{techSpec.halfLife}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded col-span-2">
                          <div className="text-[10px] uppercase text-gray-500 mb-1">Research Focus</div>
                          <div className="text-white font-bold">{techSpec.focus}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded col-span-2">
                          <div className="text-[10px] uppercase text-gray-500 mb-1">Molecular Formula</div>
                          <div className="text-white font-mono text-xs">{techSpec.formula}</div>
                        </div>
                      </div>
                    ) : (
                      <p>Technical specifications for this SKU are available upon institutional request.</p>
                    )}
                  </div>
                )}
                {activeTab === 'guide' && (
                  <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-neutral-900 p-4 rounded border border-white/10">
                        <h4 className="text-white font-bold mb-3 flex items-center text-xs uppercase tracking-wider"><AlertCircle className="h-4 w-4 mr-2 text-evo-orange" /> Pre-Reconstitution</h4>
                        <ul className="space-y-2 text-xs">
                          {STORAGE_PROTOCOLS.preReconstitution.map((item, i) => (
                            <li key={i} className="flex justify-between border-b border-white/5 pb-1">
                              <span>{item.temp}</span>
                              <span className="text-white">{item.stability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-neutral-900 p-4 rounded border border-white/10">
                        <h4 className="text-white font-bold mb-3 flex items-center text-xs uppercase tracking-wider"><Activity className="h-4 w-4 mr-2 text-evo-orange" /> Post-Reconstitution</h4>
                        <ul className="space-y-2 text-xs">
                          <li className="flex justify-between border-b border-white/5 pb-1">
                            <span>Storage</span>
                            <span className="text-white">2°C to 8°C</span>
                          </li>
                          <li className="flex justify-between border-b border-white/5 pb-1">
                            <span>Stability</span>
                            <span className="text-white">30 Days</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {product.name.toLowerCase().includes('retatrutide') && (
                      <Link
                        to="/guidance/retatrutide-20mg"
                        className="flex items-center justify-between p-4 bg-evo-lime/5 border border-evo-lime/20 rounded group hover:border-evo-lime transition-all mb-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-evo-lime p-2 rounded-full text-black">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="text-white font-bold text-xs uppercase tracking-widest">Retatrutide Protocol v1.4</div>
                            <div className="text-[10px] text-gray-500 uppercase font-medium">9-Step Visual Preparation Guide</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-evo-lime group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                    <p className="text-xs">Optimized for <strong>Evo™ Bacteriostatic (BAC) Water</strong> (0.9% Benzyl Alcohol).</p>
                  </div>
                )}
                {activeTab === 'coa' && (
                  <div className="animate-fade-in">
                    {product.coa ? (
                      <div className="flex items-center justify-between p-4 bg-neutral-900 border border-white/10 rounded group hover:border-evo-orange transition-colors">
                        <div>
                          <div className="text-white font-bold">{product.coa.productName}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-tighter">Batch: {product.coa.batchNumber} | Purity: {product.coa.purity}</div>
                        </div>
                        <Link to="/lab-testing" className="text-evo-orange hover:text-white flex items-center text-xs font-bold uppercase tracking-widest">
                          <FileText className="h-4 w-4 mr-1" /> View Full report
                        </Link>
                      </div>
                    ) : (
                      <p>Lab analysis for this batch is currently being processed. Contact our KL hub for early access.</p>
                    )}
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