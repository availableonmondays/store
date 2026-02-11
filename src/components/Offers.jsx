import React, { useState, useMemo } from 'react';

const StarRating = ({ rating = 5 }) => {
    const stars = [];
    const r = Math.round(rating * 2) / 2; // round to nearest 0.5
    for (let i = 1; i <= 5; i++) {
        if (i <= r) {
            stars.push(<span key={i} className="star-filled text-sm">★</span>);
        } else {
            stars.push(<span key={i} className="star-empty text-sm">★</span>);
        }
    }
    return <div className="flex items-center gap-0.5">{stars}<span className="text-xs text-zinc-500 ml-1">({rating})</span></div>;
};

const StockBadge = ({ status = 'In Stock' }) => {
    const config = {
        'In Stock': { class: 'stock-in', icon: '✓', text: 'In Stock' },
        'Low Stock': { class: 'stock-low', icon: '⚠', text: 'Low Stock' },
        'Out of Stock': { class: 'stock-out', icon: '✗', text: 'Out of Stock' },
    };
    const c = config[status] || config['In Stock'];
    return (
        <span className={`${c.class} text-xs font-medium flex items-center gap-1`}>
            <span>{c.icon}</span> {c.text}
        </span>
    );
};

const Offers = ({ offers, categories = [], onAddToCart, searchQuery = '' }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addedId, setAddedId] = useState(null);

    const formatPrice = (price) => {
        const num = parseFloat(price?.toString().replace(/[^0-9.]/g, '')) || 0;
        return num.toFixed(2);
    };

    const getDiscount = (offer) => {
        if (!offer.originalPrice || offer.originalPrice <= offer.price) return 0;
        return Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100);
    };

    // Hot Deals
    const hotDeals = offers.filter(o => o.isHotDeal);

    // Filter Logic
    const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            const categoryMatch = selectedCategory === 'All' || offer.category === selectedCategory;
            const priceValue = offer.price ? parseFloat(offer.price.toString().replace(/[^0-9.]/g, '')) : 0;
            const priceMatch = priceValue >= priceRange[0] && priceValue <= priceRange[1];
            const searchMatch = !searchQuery || offer.title?.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && priceMatch && searchMatch;
        });
    }, [offers, selectedCategory, priceRange, searchQuery]);

    const handleAddToCart = (e, offer) => {
        e.stopPropagation();
        if (offer.stockStatus === 'Out of Stock') return;
        if (onAddToCart) {
            onAddToCart(offer);
            setAddedId(offer._id);
            setTimeout(() => setAddedId(null), 1500);
        }
    };

    const minPercent = (priceRange[0] / 5000) * 100;
    const maxPercent = (priceRange[1] / 5000) * 100;

    // Category icons
    const categoryIcons = {
        'Gaming': '🎮', 'Keyboards': '⌨️', 'Mice': '🖱️', 'Headsets': '🎧',
        'Laptops': '💻', 'Phones': '📱', 'Monitors': '🖥️', 'Accessories': '🔌',
        'Consoles': '🕹️', 'Components': '🔧', 'Audio': '🔊', 'Storage': '💾',
    };

    return (
        <div className="bg-[#050505]">
            {/* Hot Deals Section */}
            {hotDeals.length > 0 && (
                <section id="hot-deals" className="py-16 relative">
                    <div className="container">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl animate-subtle-float">🔥</span>
                                <h3 className="text-2xl font-bold gradient-text-gold uppercase tracking-wider">
                                    Hot Deals
                                </h3>
                            </div>
                            <div className="h-px bg-gradient-to-r from-amber-500/30 to-transparent flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {hotDeals.map((offer) => {
                                const discount = getDiscount(offer);
                                return (
                                    <div
                                        key={'hot-' + offer._id}
                                        onClick={() => setSelectedProduct(offer)}
                                        className="hot-deal-card animate-shimmer-gold animate-pulse-border cursor-pointer relative"
                                    >
                                        {/* Discount Badge */}
                                        {discount > 0 && (
                                            <div className="absolute top-4 left-4 z-10 discount-badge-gold">
                                                🔥 -{discount}% OFF
                                            </div>
                                        )}

                                        {/* Limited Badge */}
                                        <div className="absolute top-4 right-4 z-10 text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full tracking-wider border border-amber-500/20">
                                            Limited
                                        </div>

                                        {/* Image */}
                                        <div className="aspect-square bg-gradient-to-b from-white/[0.02] to-transparent p-6 flex items-center justify-center">
                                            {offer.image ? (
                                                <img src={offer.image} alt={offer.title} className="w-full h-full object-contain rounded-2xl" loading="lazy" />
                                            ) : (
                                                <div className="text-zinc-700 text-sm">No Image</div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 border-t border-white/5">
                                            <h4 className="text-base font-bold text-white mb-1 line-clamp-2">{offer.title}</h4>
                                            {offer.shortDescription && (
                                                <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{offer.shortDescription}</p>
                                            )}

                                            <div className="flex items-center justify-between mb-3">
                                                <StarRating rating={offer.rating || 5} />
                                                <StockBadge status={offer.stockStatus || 'In Stock'} />
                                            </div>

                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-2xl font-bold text-amber-400">{formatPrice(offer.price)} KM</span>
                                                {offer.originalPrice > offer.price && (
                                                    <span className="text-sm text-zinc-600 line-through">{formatPrice(offer.originalPrice)} KM</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={(e) => handleAddToCart(e, offer)}
                                                disabled={offer.stockStatus === 'Out of Stock'}
                                                className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${addedId === offer._id
                                                    ? 'bg-green-600 text-white'
                                                    : offer.stockStatus === 'Out of Stock'
                                                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:from-amber-400 hover:to-orange-500'
                                                    }`}
                                            >
                                                {addedId === offer._id ? '✓ Added!' : offer.stockStatus === 'Out of Stock' ? 'Out of Stock' : '⚡ Grab This Deal'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Category Grid */}
            {categories.length > 0 && (
                <section className="py-12 px-4">
                    <div className="container">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Browse Categories</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${selectedCategory === 'All'
                                    ? 'bg-red-600/10 border-red-600/30 text-white'
                                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                                    }`}
                            >
                                <span className="text-2xl">🏪</span>
                                <span className="text-xs font-medium">All</span>
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${selectedCategory === cat
                                        ? 'bg-red-600/10 border-red-600/30 text-white'
                                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className="text-2xl">{categoryIcons[cat] || '📦'}</span>
                                    <span className="text-xs font-medium">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Store Section */}
            <section className="py-16 px-4" id="offers">
                <div className="container">
                    {/* Section Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Our <span className="gradient-text-accent">Collection</span>
                            </h2>
                            <p className="text-zinc-500 text-sm">{filteredOffers.length} products available</p>
                        </div>

                        {/* Price Filter */}
                        <div className="w-full lg:w-auto">
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 w-full lg:w-[360px]">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Price Range</span>
                                    <span className="text-sm font-bold text-white">
                                        {priceRange[0]} - {priceRange[1]} <span className="text-red-500">KM</span>
                                    </span>
                                </div>
                                <div className="relative h-5 flex items-center">
                                    <div className="absolute w-full h-1 bg-zinc-800 rounded-full" />
                                    <div
                                        className="absolute h-1 bg-red-600 rounded-full"
                                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                                    />
                                    <input
                                        type="range" min="0" max="5000" step="50"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])}
                                        className="range-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none z-10"
                                        style={{ pointerEvents: 'auto' }}
                                    />
                                    <input
                                        type="range" min="0" max="5000" step="50"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])}
                                        className="range-slider absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20"
                                        style={{ pointerEvents: 'auto' }}
                                    />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredOffers.map((offer) => {
                                const discount = getDiscount(offer);
                                return (
                                    <div
                                        key={offer._id}
                                        onClick={() => setSelectedProduct(offer)}
                                        className="product-card cursor-pointer relative"
                                    >
                                        {/* Discount Badge */}
                                        {discount > 0 && (
                                            <div className="absolute top-4 left-4 z-10 discount-badge">
                                                -{discount}%
                                            </div>
                                        )}

                                        {/* Image */}
                                        <div className="aspect-square bg-gradient-to-b from-white/[0.02] to-transparent p-6 flex items-center justify-center">
                                            {offer.image ? (
                                                <img src={offer.image} alt={offer.title} className="w-full h-full object-contain rounded-2xl" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image</div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 border-t border-white/5">
                                            <h4 className="text-sm font-bold text-white mb-1 line-clamp-2">{offer.title}</h4>
                                            {offer.shortDescription && (
                                                <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{offer.shortDescription}</p>
                                            )}

                                            <div className="flex items-center justify-between mb-3">
                                                <StarRating rating={offer.rating || 5} />
                                                <StockBadge status={offer.stockStatus || 'In Stock'} />
                                            </div>

                                            <div className="flex items-end gap-2 mb-4">
                                                <span className="text-xl font-bold text-white">{formatPrice(offer.price)} <span className="text-sm text-red-500">KM</span></span>
                                                {offer.originalPrice > offer.price && (
                                                    <span className="text-xs text-zinc-600 line-through">{formatPrice(offer.originalPrice)}</span>
                                                )}
                                            </div>

                                            {/* Always visible Add to Cart */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, offer)}
                                                disabled={offer.stockStatus === 'Out of Stock'}
                                                className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${addedId === offer._id
                                                    ? 'bg-green-600 text-white'
                                                    : offer.stockStatus === 'Out of Stock'
                                                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                        : 'bg-white/5 border border-white/10 text-white hover:bg-red-600 hover:border-red-600'
                                                    }`}
                                            >
                                                {addedId === offer._id ? '✓ Added!' : offer.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        onClick={() => setSelectedProduct(null)}
                        className="absolute inset-0 bg-black/70"
                    />
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-2 text-black animate-fade-in">
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
                            {selectedProduct.image ? (
                                <img src={selectedProduct.image} alt={selectedProduct.title} className="max-w-full max-h-[50vh] object-contain rounded-2xl" />
                            ) : (
                                <div className="text-gray-400 text-lg">No Image</div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-10 flex flex-col">
                            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">{selectedProduct.title}</h1>

                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-4">
                                <span><strong className="text-black">Kategorija:</strong> {selectedProduct.category || 'N/A'}</span>
                                <span><strong className="text-black">Garancija:</strong> {selectedProduct.warranty || '1 godina'}</span>
                            </div>

                            {/* Rating & Stock */}
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                <StarRating rating={selectedProduct.rating || 5} />
                                <StockBadge status={selectedProduct.stockStatus || 'In Stock'} />
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl md:text-5xl font-bold text-[#dc2626]">{formatPrice(selectedProduct.price)} KM</span>
                                    {selectedProduct.originalPrice > selectedProduct.price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(selectedProduct.originalPrice)} KM</span>
                                    )}
                                </div>
                                {getDiscount(selectedProduct) > 0 && (
                                    <p className="text-sm text-green-600 mt-1 font-medium">You save {(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)} KM (-{getDiscount(selectedProduct)}%)</p>
                                )}
                            </div>

                            {/* Description */}
                            {selectedProduct.description && (
                                <p className="text-gray-600 leading-relaxed mb-6">{selectedProduct.description}</p>
                            )}

                            {/* Specs */}
                            {selectedProduct.specs && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Specifications</h4>
                                    <div className="space-y-2">
                                        {selectedProduct.specs.split('\n').map((spec, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-[#0ea5e9] flex-shrink-0" />
                                                <span className="text-gray-600 text-sm">{spec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-3 mb-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1">🛡️ 2-Year Warranty</span>
                                <span className="flex items-center gap-1">💰 Cash on Delivery</span>
                                <span className="flex items-center gap-1">📍 Pickup in Sarajevo</span>
                            </div>

                            {/* CTA */}
                            <div className="mt-auto">
                                <button
                                    onClick={(e) => {
                                        handleAddToCart(e, selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                    disabled={selectedProduct.stockStatus === 'Out of Stock'}
                                    className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-colors ${selectedProduct.stockStatus === 'Out of Stock'
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-zinc-800'
                                        }`}
                                >
                                    {selectedProduct.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
