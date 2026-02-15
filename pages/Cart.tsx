import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../src/stores/cartStore';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../src/constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getItemCount } = useCartStore();

  const subtotal = getTotalPrice();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-16 bg-evo-black min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/5 p-6 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-sm">Browse our research-grade peptides and add items to get started.</p>
        <Link to="/shop" className="px-8 py-4 bg-evo-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors uppercase tracking-widest">
          Browse Shop
        </Link>
      </div>
    );
  }

  const handleWhatsAppInquiry = () => {
    const totalText = subtotal > 0 ? `totaling RM${subtotal.toFixed(2)}` : 'with unlisted items';
    let message = `Hi Evo Team, I have ${getItemCount()} item(s) in my cart ${totalText}. I'd like to inquire about this order.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-widest mb-4">
            <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
            <ArrowRight className="h-3 w-3" />
            <span className="text-white">Cart</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tight">YOUR CART</h1>
          <p className="text-gray-500 text-sm mt-1">{getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-neutral-900 border border-white/10 rounded-xl p-5 flex items-center gap-5 group hover:border-white/20 transition-colors">
                <Link to={`/product/${item.id}`} className="h-20 w-20 bg-black rounded-lg border border-white/5 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="flex-grow min-w-0">
                  <Link to={`/product/${item.id}`} className="text-white font-bold text-sm sm:text-base hover:text-evo-orange transition-colors line-clamp-1">{item.name}</Link>
                  <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {item.price > 0 ? `RM${item.price.toFixed(2)} each` : 'Price TBA'}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white transition-colors text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Line total & remove */}
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-evo-orange font-bold">
                    {item.price > 0 ? `RM${(item.price * item.quantity).toFixed(2)}` : 'TBA'}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-600 hover:text-red-500 mt-1.5 flex items-center justify-end transition-colors"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </button>
                </div>
              </div>
            ))}

            <Link to="/shop" className="inline-flex items-center text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors mt-4 gap-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-4">{item.name} × {item.quantity}</span>
                    <span className="text-white flex-shrink-0">
                      {item.price > 0 ? `RM${(item.price * item.quantity).toFixed(2)}` : 'TBA'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-white">{subtotal > 0 ? `RM${subtotal.toFixed(2)}` : 'TBA / INQUIRE'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-400 text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 mt-4 border-t border-white/10">
                <span className="text-white font-bold uppercase tracking-wider">Subtotal</span>
                <span className="text-2xl font-display font-bold text-evo-orange">
                  {subtotal > 0 ? `RM${subtotal.toFixed(2)}` : 'TBA / INQUIRE'}
                </span>
              </div>

              {/* Primary CTA: Proceed to Checkout */}
              <Link
                to="/checkout"
                className="w-full mt-6 bg-evo-orange hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-evo-orange/10 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Secondary: WhatsApp Inquiry */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full mt-3 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-bold rounded-xl flex items-center justify-center transition-all text-xs uppercase tracking-widest gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Ask via WhatsApp
              </button>

              <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest text-center justify-center">
                <ShieldCheck className="h-3 w-3" />
                Secure FPX / Card Payment
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;