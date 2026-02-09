import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Header = ({ onLoginClick, cartItemCount = 0, onCartClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                ? 'py-3'
                : 'py-5'
                }`}
        >
            <div className="container">
                <div className={`flex justify-between items-center px-6 py-3 rounded-2xl transition-all duration-500 ${scrolled
                    ? 'bg-black/30 backdrop-blur-md border border-white/5 shadow-2xl'
                    : 'bg-black/20 backdrop-blur-sm'
                    }`}>
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                    >
                        <div className="transform scale-75 origin-left">
                            <Logo />
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {['Home', 'Store', 'About', 'Contact'].map((item, i) => (
                            <motion.a
                                key={item}
                                href={item === 'Store' ? '#offers' : '#'}
                                whileHover={{ y: -2 }}
                                className="text-sm text-zinc-400 hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full" />
                            </motion.a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCartClick}
                            className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Login/Admin Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLoginClick}
                            className="hidden sm:block px-5 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            Login
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-8 right-8 p-2 text-zinc-500 hover:text-white"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <nav className="flex flex-col items-center gap-8">
                            {['Home', 'Store', 'About', 'Contact'].map((item) => (
                                <motion.a
                                    key={item}
                                    href={item === 'Store' ? '#offers' : '#'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-white tracking-widest uppercase hover:text-red-500 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLoginClick();
                                }}
                                className="mt-8 px-8 py-3 rounded-xl text-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Login
                            </motion.button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
