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
                                                <img src={offer.image} alt={offer.title} className="w-full h-full object-contain" />
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
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image</div>
                                            )}

                                            {/* Category Tag removed from image - moving to details */}

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
                                            <h4 className="text-base font-semibold text-white mb-2 line-clamp-2 transition-colors">
                                                {offer.title}
                                            </h4>

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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2 text-black"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Image Section */}
                            <div className="bg-white p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                                {selectedProduct.image && (
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.title}
                                        className="max-w-full max-h-[50vh] object-contain"
                                    />
                                )}
                            </div>

                            {/* Details Section - Custom Design */}
                            <div className="p-10 flex flex-col font-sans">
                                {/* Title */}
                                <h1 className="text-3xl font-normal text-black mb-4">
                                    {selectedProduct.title}
                                </h1>

                                {/* Meta Row */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-6">
                                    <span className="font-bold text-black">Kategorija: <span className="font-normal text-gray-600">{selectedProduct.category || 'N/A'}</span></span>
                                    <span className="font-bold text-black">SKU: <span className="font-normal text-gray-600">{selectedProduct._id.slice(0, 6)}</span></span>
                                    <span className="font-bold text-black">Garancija: <span className="font-normal text-gray-600">{selectedProduct.warranty || '1 godina'}</span></span>
                                </div>

                                {/* Availability Check */}
                                <div className="flex items-center gap-2 text-sm text-black mb-8 pb-8 border-b border-gray-100">
                                    <span>Potrebna provjera dostupnosti</span>
                                    <div className="w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] font-bold">?</div>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <p className="text-5xl font-bold text-[#dc2626] tracking-tight">
                                        {formatPrice(selectedProduct.price)} KM
                                    </p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        (Cijena sa popustom za gotovinsko plaćanje)
                                    </p>
                                </div>

                                {/* Specs with Blue Bullets */}
                                {selectedProduct.specs && (
                                    <div className="space-y-3 mb-10">
                                        {selectedProduct.specs.split('\n').map((spec, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-[#0ea5e9] flex-shrink-0" />
                                                <span className="text-gray-600">{spec}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="mt-auto flex gap-4">
                                    <button
                                        onClick={(e) => {
                                            handleAddToCart(e, selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="flex-1 bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                                    >
                                        Add to Cart
                                    </button>
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
