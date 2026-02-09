import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoginModal = ({ onLogin, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ESC to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate network delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === 'owner' && password === 'admin123') {
            onLogin();
            onClose();
        } else {
            setError('Invalid credentials');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={shake
                    ? { x: [0, -12, 12, -12, 12, 0], scale: 1, opacity: 1, y: 0 }
                    : { scale: 1, opacity: 1, y: 0 }
                }
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
                className="bg-[#0a0a0a] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl shadow-red-900/10 relative z-10 overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-20"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </motion.button>

                <div className="p-10 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-sm text-zinc-500">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter your username"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-xl p-3"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 rounded-xl font-bold tracking-wider text-base flex items-center justify-center gap-3 mt-8 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-xs text-zinc-600 mt-8">
                        Protected access for authorized personnel only
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;
