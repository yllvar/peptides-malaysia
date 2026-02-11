import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-evo-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8">PRIVACY POLICY</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
            <p>Peptides Malaysia ("We") respects the privacy of our research community. We do not create persistent user accounts on this platform. Order data is generated locally in your browser and transmitted directly to our sales team via WhatsApp encryption. We do not store your shipping address or phone number in any centralized database connected to this website.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Usage of Information</h2>
            <p>Information provided during the checkout process is strictly used for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Processing your immediate order.</li>
                <li>Arranging logistics via third-party couriers (J&T, Lalamove, PosLaju).</li>
                <li>Communicating payment details.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Third-Party Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties, except for trusted third parties who assist us in operating our logistics (courier services), so long as those parties agree to keep this information confidential.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Cookies</h2>
            <p>This site uses local storage to maintain your cart session. No tracking pixels or advertising cookies are utilized.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;