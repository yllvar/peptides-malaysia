import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8">TERMS OF SERVICE</h1>
        
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded mb-8">
            <h3 className="text-red-500 font-bold mb-2 uppercase tracking-wide">Critical Warning</h3>
            <p className="text-red-200 text-sm">All products sold on this site are for LABORATORY RESEARCH USE ONLY. They are not for human consumption, veterinary use, or cosmetic application.</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing Peptides Malaysia, you agree to be bound by these Terms of Service. If you do not agree, you must exit the site immediately. You affirm that you are at least 18 years of age (or 21 where applicable by law).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Intended Use</h2>
            <p>Products sold by Peptides Malaysia (Evo™ Brand) are intended exclusively for in-vitro laboratory research. </p>
            <p className="mt-2">By purchasing, you acknowledge that:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>You are a qualified researcher or representative of a research institution.</li>
                <li>You understand the hazards associated with handling chemical compounds.</li>
                <li>You will not introduce these products into a human or animal body.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Liability</h2>
            <p>Peptides Malaysia shall not be held liable for any damages that result from the use or misuse of our products. The purchaser assumes all responsibility for complying with local regulations regarding the possession and use of these compounds.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Returns & Refunds</h2>
            <p>Due to the temperature-sensitive nature of lyophilized peptides and the risk of contamination, <strong>all sales are final.</strong> We do not accept returns. If a product arrives damaged (broken glass), please contact support via WhatsApp within 24 hours with photographic evidence for a replacement.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;