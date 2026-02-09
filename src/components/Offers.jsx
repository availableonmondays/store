import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Offers = ({ offers, categories = [], onAddToCart }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addedId, setAddedId] = useState(null);

    // Helper to format price
    const formatPrice = (price) => {
        const num = parseFloat(price?.toString().replace(/[^0-9.]/g, '')) || 0;
        return num.toFixed(2);
    };

    // Hot Deals
    const hotDeals = offers.filter(o => o.isHotDeal).slice(0, 2);

    // Filter Logic
    const filteredOffers = offers.filter(offer => {
        const categoryMatch = selectedCategory === 'All' || offer.category === selectedCategory;
        const priceValue = offer.price ? parseFloat(offer.price.toString().replace(/[^0-9.]/g, '')) : 0;
        const priceMatch = priceValue >= priceRange[0] && priceValue <= priceRange[1];
        return categoryMatch && priceMatch;
    });

    const handleMinChange = (e) => {
        const value = Math.min(Number(e.target.value), priceRange[1] - 100);
        setPriceRange([value, priceRange[1]]);
    };

    const handleMaxChange = (e) => {
        const value = Math.max(Number(e.target.value), priceRange[0] + 100);
        setPriceRange([priceRange[0], value]);
    };

    const handleAddToCart = (e, offer) => {
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(offer);
            setAddedId(offer._id);
            setTimeout(() => setAddedId(null), 1500);
        }
    };

    const minPercent = (priceRange[0] / 5000) * 100;
    const maxPercent = (priceRange[1] / 5000) * 100;

    return (
        <div className="bg-[#050505] relative noise-overlay">
            <style>{`
                .range-slider::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #dc2626;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-top: -7px;
                    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
                }
                .range-slider::-moz-range-thumb {
                    pointer-events: auto;
                    width: 18px;
                    height: 18px;
                    background: #dc2626;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .range-slider::-webkit-slider-runnable-track {
                    appearance: none;
                    height: 4px;
                    background: transparent;
                }
                @keyframes fire-border {
                    0%, 100% { border-color: rgba(220, 38, 38, 0.6); box-shadow: 0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(255, 165, 0, 0.2); }
                    25% { border-color: rgba(255, 165, 0, 0.7); box-shadow: 0 0 25px rgba(255, 165, 0, 0.4), 0 0 50px rgba(220, 38, 38, 0.3); }
                    50% { border-color: rgba(255, 215, 0, 0.6); box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), 0 0 60px rgba(255, 165, 0, 0.2); }
                    75% { border-color: rgba(255, 100, 0, 0.7); box-shadow: 0 0 25px rgba(255, 100, 0, 0.4), 0 0 50px rgba(220, 38, 38, 0.3); }
                }
                .hot-deal-card {
                    background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(255, 165, 0, 0.05) 50%, rgba(255, 215, 0, 0.08) 100%);
                    border: 2px solid rgba(255, 165, 0, 0.3);
                }
                .hot-deal-card:hover {
                    animation: fire-border 1.5s ease-in-out infinite;
                }
            `}</style>

            {/* Hot Deals Section */}
            {hotDeals.length > 0 && (
                <section className="py-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />
                    <div className="container relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex items-center gap-3">
                                <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                </span>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                    Hot Deals
                                </h3>
                            </div>
                            <div className="h-px bg-gradient-to-r from-red-600/50 to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {hotDeals.map((offer, i) => (
                                <motion.div
                                    key={'hot-' + offer._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedProduct(offer)}
                                    className="hot-deal-card group relative rounded-2xl p-6 cursor-pointer transition-all duration-500 overflow-hidden"
                                >
                                    {/* Fire gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/10 to-yellow-900/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                                    </div>

                                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-full tracking-wider shadow-lg shadow-red-900/30">
                                        Limited
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                        <div className="w-full md:w-40 h-40 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {offer.image ? (
                                                <img src={offer.image} alt={offer.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <span className="text-zinc-700 text-xs">No Image</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{offer.title}</h4>
                                            <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{offer.description || 'Premium gaming gear'}</p>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <span className="text-xs text-zinc-600 uppercase tracking-wider">Price</span>
                                                    <p className="text-3xl font-black text-red-500" style={{ fontFamily: 'var(--font-display)' }}>
                                                        {formatPrice(offer.price)} <span className="text-lg">KM</span>
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => handleAddToCart(e, offer)}
                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-500 transition-colors"
                                                >
                                                    Add to Cart
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Store Section */}
            <section className="py-16 px-4" id="offers">
                <div className="container">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                            Our <span className="gradient-text-accent">Collection</span>
                        </h2>
                        <p className="text-zinc-500 max-w-xl mx-auto">
                            Handpicked premium gear for the most demanding gamers
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="mb-10 space-y-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            {/* Category Tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full lg:w-auto">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'All'
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Price Filter */}
                            <div className="w-full lg:w-auto">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 w-full lg:w-[400px]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Price Range</span>
                                        <span className="text-sm font-bold text-white">
                                            {priceRange[0]} - {priceRange[1]} <span className="text-red-500">KM</span>
                                        </span>
                                    </div>

                                    <div className="relative h-5 flex items-center">
                                        <div className="absolute w-full h-1 bg-zinc-800 rounded-full" />
                                        <div
                                            className="absolute h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                                            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                                        />
                                        <input
                                            type="range"
                                            min="0" max="5000" step="50"
                                            value={priceRange[0]}
                                            onChange={handleMinChange}
                                            className="range-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none z-10"
                                        />
                                        <input
                                            type="range"
                                            min="0" max="5000" step="50"
                                            value={priceRange[1]}
                                            onChange={handleMaxChange}
                                            className="range-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredOffers.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            </div>
                            <p className="text-zinc-500">No products found</p>
                            <p className="text-sm text-zinc-600 mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            <AnimatePresence mode="popLayout">
                                {filteredOffers.map((offer, i) => (
                                    <motion.div
                                        key={offer._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => setSelectedProduct(offer)}
                                        className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden cursor-pointer card-hover hover:border-white/10"
                                    >
                                        {/* Image */}
                                        <div className="aspect-square bg-gradient-to-b from-white/[0.02] to-transparent p-6 relative overflow-hidden">
                                            {offer.image ? (
                                                <img
                                                    src={offer.image}
                                                    alt={offer.title}
                                                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image</div>
                                            )}

                                            {/* Category Tag */}
                                            <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur text-[10px] font-medium uppercase tracking-wider text-zinc-400 rounded-lg">
                                                {offer.category || 'Product'}
                                            </div>

                                            {/* Quick Add Button */}
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={(e) => handleAddToCart(e, offer)}
                                                className={`absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${addedId === offer._id
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600'
                                                    }`}
                                            >
                                                {addedId === offer.id ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="9" cy="21" r="1" />
                                                        <circle cx="20" cy="21" r="1" />
                                                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                                                    </svg>
                                                )}
                                            </motion.button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h4 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                                                {offer.title}
                                            </h4>

                                            {offer.specs && (
                                                <ul className="text-[11px] text-zinc-500 space-y-1 mb-4">
                                                    {offer.specs.split('\n').slice(0, 2).map((spec, i) => (
                                                        <li key={i} className="flex items-center gap-1.5">
                                                            <span className="w-1 h-1 bg-red-600 rounded-full" />
                                                            {spec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div>
                                                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Price</span>
                                                    <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                                        {formatPrice(offer.price)} <span className="text-sm text-red-500">KM</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    >
                        <div
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Image */}
                            <div className="bg-gradient-to-b from-white/[0.02] to-transparent p-12 flex items-center justify-center">
                                {selectedProduct.image && (
                                    <motion.img
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        src={selectedProduct.image}
                                        alt={selectedProduct.title}
                                        className="max-w-full max-h-[50vh] object-contain drop-shadow-2xl"
                                    />
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-10 flex flex-col border-l border-white/5">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-red-600/10 text-red-500 text-xs font-bold uppercase rounded-full tracking-wider">
                                        {selectedProduct.category || 'Product'}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                    {selectedProduct.title}
                                </h2>

                                <div className="flex-1 space-y-6">
                                    <div className="pb-6 border-b border-white/5">
                                        <p className="text-5xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                            {formatPrice(selectedProduct.price)} <span className="text-2xl text-red-500">KM</span>
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-2">Includes VAT • 2 Year Warranty</p>
                                    </div>

                                    {selectedProduct.description && (
                                        <p className="text-zinc-400 leading-relaxed">{selectedProduct.description}</p>
                                    )}

                                    {selectedProduct.specs && (
                                        <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                                            <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Specifications</h4>
                                            <ul className="space-y-2">
                                                {selectedProduct.specs.split('\n').map((spec, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                                                        <span className="w-1.5 h-1.5 mt-2 bg-red-500 rounded-full flex-shrink-0" />
                                                        {spec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                            handleAddToCart(e, selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="flex-1 btn-primary py-4 rounded-xl font-bold tracking-wider flex items-center justify-center gap-2"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                                        </svg>
                                        <span>Add to Cart</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Offers;
