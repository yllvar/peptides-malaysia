import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../src/constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'Product Question',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = `*NEW INQUIRY - EVO PEPTIDES*\n\n` +
      `*From:* ${formData.firstName} ${formData.lastName}\n` +
      `*Email:* ${formData.email}\n` +
      `*Type:* ${formData.inquiryType}\n\n` +
      `*Message:*\n${formData.message}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-white mb-4">GET IN TOUCH</h1>
          <p className="text-gray-400">Expert support for your research needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Direct Contact Info */}
          <div className="space-y-8">
            <div className="bg-neutral-900 p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Support Channels</h3>

              <div className="space-y-6">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center group p-4 bg-black/50 rounded border border-white/5 hover:border-green-500/50 transition-colors"
                >
                  <div className="bg-green-500/10 p-3 rounded-full mr-4 group-hover:bg-green-500/20">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">WhatsApp (Fastest)</div>
                    <div className="text-white font-bold text-lg">+{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 4)}-{WHATSAPP_NUMBER.slice(4, 8)} {WHATSAPP_NUMBER.slice(8)}</div>
                  </div>
                </a>

                <div className="flex items-center p-4 bg-black/50 rounded border border-white/5">
                  <div className="bg-evo-orange/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-evo-orange" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email Inquiries</div>
                    <div className="text-white font-bold text-lg">support@evopeptides.shop</div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-black/50 rounded border border-white/5">
                  <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Logistics Hub</div>
                    <div className="text-white font-bold">Kuala Lumpur, Malaysia</div>
                    <div className="text-xs text-gray-500 mt-1">Shipping via J&T, PosLaju, Lalamove</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                >
                  <option>Product Question</option>
                  <option>Order Status</option>
                  <option>Bulk/Wholesale</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-evo-orange focus:outline-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-evo-orange hover:bg-evo-orangeHover text-white font-bold rounded transition-colors">
                SEND MESSAGE
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>

  );
};

export default Contact;