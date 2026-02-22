import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCartStore } from '../src/stores/cartStore';
import { CheckCircle2, XCircle, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

const PaymentStatus: React.FC = () => {
    const [searchParams] = useSearchParams();
    const clearCart = useCartStore((state) => state.clearCart);

    const status = searchParams.get('status_id'); // 1 = Success, 3 = Failed
    const billCode = searchParams.get('billcode');
    const orderRef = searchParams.get('order_id');

    const method = searchParams.get('method');
    const orderNumber = searchParams.get('order_number');

    useEffect(() => {
        if (status === '1' || (method === 'manual' && orderNumber)) {
            clearCart();
        }
    }, [status, method, orderNumber, clearCart]);

    // Format WhatsApp Message
    const whatsappMessage = encodeURIComponent(`Hi Evo, I've just placed order #${orderNumber}. Here is my payment receipt for verification.`);
    const whatsappUrl = `https://wa.me/601133373941?text=${whatsappMessage}`;

    if (method === 'manual') {
        return (
            <div className="pt-32 pb-16 bg-evo-black min-h-screen">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
                        {/* Header Section */}
                        <div className="p-8 md:p-12 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="flex justify-center mb-6">
                                <div className="bg-evo-orange/10 p-4 rounded-full">
                                    <Clock className="h-12 w-12 text-evo-orange animate-pulse" />
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase italic tracking-tighter">ORDER INITIALIZED</h1>
                            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                                Your research batch has been reserved. Please complete the bank transfer below to trigger laboratory dispatch.
                            </p>
                        </div>

                        {/* Order ID Banner */}
                        <div className="bg-evo-orange/90 py-4 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <span className="text-black font-black uppercase tracking-[0.3em] text-[10px]">Reference Identification</span>
                            <span className="text-white font-display font-black italic text-2xl tracking-widest">{orderNumber}</span>
                        </div>

                        {/* Payment Details */}
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Target Repository</p>
                                        <p className="text-white font-bold uppercase">United Overseas Bank (UOB)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Account Name</p>
                                        <p className="text-white font-display font-bold text-lg italic uppercase">UDB TECH VENTURES</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Account Number</p>
                                        <p className="text-evo-orange font-mono font-black text-2xl">911-305-327-1</p>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Verification */}
                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] text-center">Fast-Track Verification</p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-white text-black font-black py-6 rounded-2xl hover:bg-evo-orange hover:text-white transition-all text-center uppercase tracking-[0.2em] text-xs shadow-xl group"
                                >
                                    <span className="flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
                                        Submit Receipt via WhatsApp <ArrowRight className="h-5 w-5" />
                                    </span>
                                </a>
                                <p className="text-[9px] text-gray-600 font-medium uppercase tracking-widest text-center italic">
                                    Verification usually takes 5-15 minutes during lab hours.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col items-center gap-4">
                            <Link to="/" className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
                                Return to Hub
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 bg-evo-black min-h-screen">
            <div className="max-w-xl mx-auto px-4 text-center">

                {status === '1' ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="bg-green-500/10 p-4 rounded-full">
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-4">PURCHASE COMPLETE</h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Order <strong>#{orderRef?.slice(-6).toUpperCase()}</strong> has been successfully processed.
                            A confirmation email will be sent to your research lab shortly.
                        </p>
                        <div className="space-y-4">
                            <Link to="/shop" className="block w-full bg-evo-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors uppercase tracking-widest">
                                Continue Research
                            </Link>
                            <Link to="/" className="block w-full text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                                Back to Main Hub
                            </Link>
                        </div>
                    </div>
                ) : status === '3' ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="bg-red-500/10 p-4 rounded-full">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-4">PAYMENT FAILED</h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Your transaction was not successful. This could be due to a bank timeout or cancelled session. No funds were deducted.
                        </p>
                        <div className="space-y-4">
                            <Link to="/checkout" className="block w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                Try Again <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link to="/cart" className="block w-full text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                                Return to Cart
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="bg-orange-500/10 p-4 rounded-full">
                                <Clock className="h-16 w-16 text-orange-500 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-4">PENDING VERIFICATION</h1>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We are awaiting confirmation from the payment gateway. Your research materials are being allocated in the meantime.
                        </p>
                        <Link to="/" className="block w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-colors uppercase tracking-widest">
                            Return Home
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentStatus;
