import React, { useState } from 'react';
import { useAuthStore } from '../src/stores/authStore';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const setAuth = useAuthStore((state) => state.setAuth);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin ? { email, password } : { email, password, fullName, phone };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            if (isLogin) {
                setAuth(data.user, data.accessToken, data.refreshToken); // requires stores/authStore update? No, setAuth(user, access, refresh)
                onClose();
                // Reset form
                setEmail('');
                setPassword('');
            } else {
                setSuccess('Account created! Please log in.');
                setIsLogin(true);
                setPassword(''); // Clear password for safety
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="p-8 pb-0 text-center">
                    <h2 className="text-2xl font-display font-bold text-white mb-2">
                        {isLogin ? 'WELCOME BACK' : 'JOIN THE RESEARCH'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin
                            ? 'Access your order history and lab data.'
                            : 'Create an account for expedited checkout.'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs p-3 rounded text-center">
                            {success}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-evo-orange focus:ring-1 focus:ring-evo-orange transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                <input
                                    type="tel"
                                    placeholder="Phone (Optional)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-evo-orange focus:ring-1 focus:ring-evo-orange transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-evo-orange focus:ring-1 focus:ring-evo-orange transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-evo-orange focus:ring-1 focus:ring-evo-orange transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-evo-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? 'LOGIN' : 'CREATE ACCOUNT')}
                    </button>
                </form>

                {/* Footer */}
                <div className="bg-white/5 p-4 text-center border-t border-white/10">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                        className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
