import React, { useState, useEffect } from 'react';
import { X, Mail, Download, CheckCircle, Shield } from 'lucide-react';

const Magnet: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Show after 5 seconds if not dismissed
    const hasSeen = localStorage.getItem('evo_magnet_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/auth/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem('evo_magnet_seen', 'true');
        setTimeout(() => setIsVisible(false), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('evo_magnet_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-8 left-8 z-[100] transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="relative bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-4 animate-fade-in">
            <div className="bg-evo-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-evo-orange" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2 uppercase italic">PROTOCOL TRANSMITTED</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">
              Check your lab terminal (inbox) for the Evo™ Safety Protocol PDF.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-evo-orange p-2.5 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white uppercase italic tracking-tight">EVO™ RESEARCH PROTOCOL</h3>
                <p className="text-[10px] text-evo-orange font-black uppercase tracking-widest">v1.4 Safety Protocol</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed uppercase tracking-wider">
              Download the official laboratory handling & reconstitution guide for the Evo™ Series.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  placeholder="Enter Research Email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder:text-gray-600 focus:border-evo-orange/50 focus:bg-white/10 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-evo-orange hover:bg-evo-orange/90 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-evo-orange/20 transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? 'TRANSMITTING...' : (
                  <><Download size={14} /> DOWNLOAD PROTOCOL</>
                )}
              </button>
            </form>

            {status === 'error' && (
              <p className="text-[10px] text-red-500 mt-3 text-center font-bold uppercase tracking-widest">
                Connection failed. Please try again.
              </p>
            )}

            <p className="text-[8px] text-gray-600 mt-4 text-center uppercase tracking-tighter">
              By requesting, you agree to our Research-Only Handling Terms.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Magnet;
