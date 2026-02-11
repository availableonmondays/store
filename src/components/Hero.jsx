import React, { useState, useMemo } from 'react';

const Hero = ({ offers = [], onProductClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return offers
            .filter(o => o.title?.toLowerCase().includes(q) || o.category?.toLowerCase().includes(q))
            .slice(0, 5);
    }, [searchQuery, offers]);

    const showDropdown = isFocused && searchQuery.trim().length > 0;

    const trustBadges = [
        { icon: '🛡️', text: '2-Year Warranty' },
        { icon: '💰', text: 'Cash on Delivery' },
        { icon: '📍', text: 'Pickup in Sarajevo' },
        { icon: '✅', text: 'Official Distributor' },
    ];

    return (
        <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
            {/* Clean gradient bg — no SVGs, no dots, no mouse tracking */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%), linear-gradient(180deg, #050505 0%, #0a0a0a 100%)'
                }}
            />

            <div className="container relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.1] text-white">
                    Premium Gaming &<br />
                    <span className="gradient-text-accent">Electronics</span>
                </h1>

                <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
                    Official distributor in Sarajevo. Best prices, genuine products, 2-year warranty on everything.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto mb-12">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-white text-base outline-none focus:border-red-600/50 transition-colors"
                        />
                    </div>

                    {/* Search Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <button
                                        key={product._id}
                                        onClick={() => {
                                            if (onProductClick) onProductClick(product);
                                            setSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                            {product.image ? (
                                                <img src={product.image} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">—</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{product.title}</p>
                                            <p className="text-xs text-zinc-500">{product.category}</p>
                                        </div>
                                        <span className="text-sm font-bold text-red-500 flex-shrink-0">
                                            {parseFloat(product.price || 0).toFixed(2)} KM
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-sm text-zinc-500">
                                    No products found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-3">
                    {trustBadges.map((badge, i) => (
                        <div key={i} className="trust-badge">
                            <span>{badge.icon}</span>
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
