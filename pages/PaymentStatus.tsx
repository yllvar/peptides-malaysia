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

    useEffect(() => {
        if (status === '1') {
            clearCart();
        }
    }, [status, clearCart]);

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
