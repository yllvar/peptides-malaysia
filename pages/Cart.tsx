import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../src/stores/cartStore';
import { Trash2, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../src/constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postcode: ''
  });
  const [error, setError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 10; // Flat rate RM10
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setError('');
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    // Basic Validation
    if (!customer.name || !customer.address || !customer.city || !customer.phone || !customer.postcode) {
      setError('Please fill in ALL shipping details to generate the order.');
      return;
    }

    // Phone Validation (Malaysia format: 601...)
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('60') || cleanPhone.length < 11 || cleanPhone.length > 13) {
      setError('Invalid Phone Number. Use format: 60123456789');
      return;
    }

    // Postcode Validation (Malaysia: 5 digits)
    if (!/^\d{5}$/.test(customer.postcode)) {
      setError('Invalid Postcode. Must be exactly 5 digits.');
      return;
    }

    let message = `*NEW ORDER - PEPTIDES MALAYSIA*\n\n`;
    message += `*Customer Details:*\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${customer.address}, ${customer.postcode} ${customer.city}\n\n`;
    message += `*Order Items:*\n`;

    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} (RM${item.price * item.quantity})\n`;
    });

    message += `\n*Subtotal:* RM${subtotal}`;
    message += `\n*Shipping:* RM${shipping}`;
    message += `\n*TOTAL:* RM${total}`;
    message += `\n\nPayment Method: Bank Transfer (Requesting Account Details)`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-16 bg-evo-black min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Ready to start your research?</p>
        <Link to="/shop" className="px-8 py-3 bg-evo-orange text-white font-bold rounded hover:bg-evo-orangeHover transition-colors">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-white mb-8">CART & CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Items & Shipping Form */}
          <div className="lg:col-span-2 space-y-8">

            {/* Cart Items */}
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">1. Order Items</h3>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-800" />
                    <div className="ml-4 flex-1">
                      <h3 className="text-white font-bold text-sm sm:text-base">{item.name}</h3>
                      <div className="text-xs text-gray-400">{item.category}</div>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-2 space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-evo-orange font-bold">RM{item.price * item.quantity}</div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-400 mt-2 flex items-center justify-end ml-auto"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Shipping Form */}
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">2. Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                    placeholder="Researcher Name"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">WhatsApp Number</label>
                  <input
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                    placeholder="+60..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Street Address</label>
                  <input
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                    placeholder="Unit, Building, Street"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">City</label>
                  <input
                    name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                    placeholder="Kuala Lumpur"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Postcode</label>
                  <input
                    name="postcode"
                    value={customer.postcode}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                    placeholder="50450"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-white/10 p-6 rounded sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Summary</h3>

              <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>RM{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping (Flat Rate)</span>
                  <span>RM{shipping}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-white mb-8">
                <span>Total</span>
                <span>RM{total}</span>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-xs text-red-200">{error}</p>
                </div>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded flex items-center justify-center transition-all mb-4 shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)]"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> COMPLETE ORDER
              </button>

              <p className="text-xs text-center text-gray-500 leading-relaxed">
                By clicking "Complete Order", you will be redirected to WhatsApp to send your pre-filled order details to our sales team. Payment instructions (Bank Transfer) will be provided there.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;