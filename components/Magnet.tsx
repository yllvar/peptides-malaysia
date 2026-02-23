import React, { useState, useEffect } from 'react';
import { X, Mail, Download, CheckCircle, Shield, ArrowRight } from 'lucide-react';

const Magnet: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const hasSeen = localStorage.getItem('evo_magnet_seen');
    if (!hasSeen) {
      // 1. Prepare for rendering
      const renderTimer = setTimeout(() => {
        setShouldRender(true);
        // 2. Trigger animation in next tick
        setTimeout(() => setShowContent(true), 100);
      }, 5000);
      return () => clearTimeout(renderTimer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
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
        // Close after 5 seconds automatically on success
        setTimeout(() => handleClose(), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setShowContent(false);
    localStorage.setItem('evo_magnet_seen', 'true');
    // Remove from DOM after transition
    setTimeout(() => setShouldRender(false), 700);
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
      <div className="relative bg-[#0a0a0a] border border-white/10 p-7 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] max-w-[320px] overflow-hidden group">
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-white transition-colors z-10 p-1 hover:bg-white/5 rounded-full"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-evo-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(255,77,0,0.2)]">
              <CheckCircle className="text-evo-orange" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3 uppercase italic tracking-tight">PROTOCOL TRANSMITTED</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
              Check your laboratory terminal (inbox) for the Evo™ Safety Protocol PDF.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-evo-orange flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(255,77,0,0.3)]">
                <Shield className="text-white" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-display font-bold text-white uppercase italic tracking-tight leading-none mb-1">EVO™ PROTOCOL</h3>
                <p className="text-[9px] text-evo-orange font-black uppercase tracking-widest whitespace-nowrap">Safety & Handling Guide</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 mb-6 leading-relaxed font-medium">
              Obtain the official Evo™ Series Research Protocol. Reconstitution data & peer-reviewed handling procedures.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-evo-orange transition-colors" size={14} />
                <input
                  type="email"
                  required
                  placeholder="Enter Research Email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder:text-gray-600 focus:border-evo-orange/50 focus:bg-white/[0.07] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-evo-orange hover:bg-orange-600 active:scale-[0.98] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.25em] shadow-lg shadow-evo-orange/20 transition-all flex items-center justify-center gap-2 group/btn"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    TRANSMITTING...
                  </span>
                ) : (
                  <>
                    DOWNLOAD PROTOCOL
                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={handleClose}
                className="text-[9px] text-gray-600 hover:text-white uppercase tracking-widest font-bold transition-colors"
              >
                No, Dismiss
              </button>
              <div className="flex items-center gap-1.5 grayscale opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Secure Link</span>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-[9px] text-red-500 mt-4 text-center font-bold uppercase tracking-widest animate-pulse">
                Verification failed. Please retry.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Magnet;

