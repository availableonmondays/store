import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = ({ offers, categories, onAddOffer, onDeleteOffer, onUpdateCategories, onClose, onLogout }) => {
    const [activeTab, setActiveTab] = useState('add');
    const [newOffer, setNewOffer] = useState({ title: '', description: '', price: '', image: '', category: '', specs: '', isHotDeal: false });
    const [newCategory, setNewCategory] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewOffer({ ...newOffer, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newOffer.title) return;

        onAddOffer({
            ...newOffer
        });
        setNewOffer({ title: '', description: '', price: '', image: '', category: '', specs: '', isHotDeal: false });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory && !categories.includes(newCategory)) {
            onUpdateCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const handleDeleteCategory = (cat) => {
        onUpdateCategories(categories.filter(c => c !== cat));
    };

    const tabs = [
        { id: 'add', label: 'Products', icon: '📦' },
        { id: 'categories', label: 'Categories', icon: '🏷️' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="bg-[#0a0a0a] w-full max-w-xl h-full border-l border-white/10 relative z-10 flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Control Center</h2>
                            <p className="text-xs text-zinc-500">Manage your store</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-red-600/20 rounded-lg transition-colors"
                        >
                            Logout
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-2 border-b border-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                ? 'bg-white text-black'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'add' ? (
                            <motion.div
                                key="add"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Add Form */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1 h-5 bg-red-600 rounded-full" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Product</h3>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Title</label>
                                                <input
                                                    type="text"
                                                    value={newOffer.title}
                                                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Product name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Price (KM)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={newOffer.price}
                                                    onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                                                    className="input-field"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Category</label>
                                                <select
                                                    value={newOffer.category}
                                                    onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                                                    className="input-field appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <label className={`flex items-center justify-center gap-3 w-full h-[52px] rounded-xl cursor-pointer transition-all border ${newOffer.isHotDeal
                                                    ? 'bg-red-600/20 border-red-600/50 text-red-400'
                                                    : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10'
                                                    }`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={newOffer.isHotDeal}
                                                        onChange={(e) => setNewOffer({ ...newOffer, isHotDeal: e.target.checked })}
                                                        className="hidden"
                                                    />
                                                    <span className="text-sm font-medium">🔥 Hot Deal</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Description</label>
                                            <textarea
                                                value={newOffer.description}
                                                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                                className="input-field resize-none h-20"
                                                placeholder="Brief product description..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Specifications</label>
                                            <textarea
                                                value={newOffer.specs}
                                                onChange={(e) => setNewOffer({ ...newOffer, specs: e.target.value })}
                                                className="input-field resize-none h-28 font-mono text-sm"
                                                placeholder="One spec per line&#10;E.g.: 16GB RAM&#10;RTX 4080"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase text-zinc-500 mb-2 font-medium">Image</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex items-center justify-center gap-3 w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-red-500/50 transition-colors"
                                                >
                                                    {newOffer.image ? (
                                                        <img src={newOffer.image} alt="Preview" className="h-full object-contain rounded-lg" />
                                                    ) : (
                                                        <div className="text-center">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" className="mx-auto mb-2">
                                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                                <polyline points="17,8 12,3 7,8" />
                                                                <line x1="12" y1="3" x2="12" y2="15" />
                                                            </svg>
                                                            <span className="text-xs text-zinc-500">Click to upload</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full btn-primary py-4 rounded-xl font-bold tracking-wider"
                                        >
                                            <span>Add Product</span>
                                        </motion.button>
                                    </form>

                                    {/* Success Toast */}
                                    <AnimatePresence>
                                        {showSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="absolute bottom-4 left-4 right-4 bg-green-600/20 border border-green-600/30 text-green-400 text-sm font-medium py-3 px-4 rounded-xl flex items-center gap-2"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                                Product added successfully!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Inventory */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                            Inventory ({offers.length})
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <AnimatePresence mode="popLayout">
                                            {offers.map((offer) => (
                                                <motion.div
                                                    key={offer._id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                                    className="group flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
                                                >
                                                    <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                                        {offer.image ? (
                                                            <img src={offer.image} className="w-full h-full object-contain" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">N/A</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h5 className="font-semibold text-white text-sm truncate">{offer.title}</h5>
                                                            {offer.isHotDeal && (
                                                                <span className="text-[10px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded font-bold">HOT</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-zinc-500">
                                                            {offer.price} KM • {offer.category || 'No category'}
                                                        </p>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onDeleteOffer(offer._id)}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-red-600/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                        </svg>
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {offers.length === 0 && (
                                            <div className="text-center py-12 text-zinc-600 border border-dashed border-white/5 rounded-xl">
                                                <p className="text-sm">No products yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Add Category */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1 h-5 bg-red-600 rounded-full" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Category</h3>
                                    </div>

                                    <form onSubmit={handleAddCategory} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="input-field flex-1"
                                            placeholder="Category name"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            Add
                                        </motion.button>
                                    </form>
                                </div>

                                {/* Categories List */}
                                <div className="grid grid-cols-2 gap-3">
                                    <AnimatePresence mode="popLayout">
                                        {categories.map((cat) => (
                                            <motion.div
                                                key={cat}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="group flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
                                            >
                                                <span className="text-white font-medium text-sm">{cat}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-red-600/20 hover:text-red-400 transition-all"
                                                >
                                                    ×
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Keyboard Hint */}
                <div className="p-4 border-t border-white/5 text-center">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                        Press <span className="text-zinc-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">ESC</span> to close
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminPanel;
