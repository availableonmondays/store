import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Header = ({ onLoginClick, cartItemCount = 0, onCartClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
        >
            <div className="container">
                <div className={`flex justify-between items-center px-6 py-3 rounded-2xl transition-all duration-300 ${scrolled
                    ? 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50'
                    : 'bg-transparent'
                    }`}>
                    {/* Logo */}
                    <a href="#" className="cursor-pointer">
                        <div className="transform scale-75 origin-left">
                            <Logo />
                        </div>
                    </a>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {[
                            { label: 'Home', href: '#' },
                            { label: 'Store', href: '#offers' },
                            { label: 'Hot Deals', href: '#hot-deals' },
                            { label: 'Contact', href: '#' },
                        ].map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart Button */}
                        <button
                            onClick={onCartClick}
                            className="relative p-2.5 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Login Button */}
                        <button
                            onClick={onLoginClick}
                            className="hidden sm:block px-5 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Login
                        </button>

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

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black/98 md:hidden flex flex-col items-center justify-center">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-8 right-8 p-2 text-zinc-500 hover:text-white"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <nav className="flex flex-col items-center gap-8">
                        {['Home', 'Store', 'Hot Deals', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={item === 'Store' ? '#offers' : item === 'Hot Deals' ? '#hot-deals' : '#'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-bold text-white tracking-widest uppercase hover:text-red-500 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onLoginClick();
                            }}
                            className="mt-8 px-8 py-3 rounded-xl text-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            Login
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
