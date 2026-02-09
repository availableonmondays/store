import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = ({ isOpen, onClose, cart, onRemove, onUpdateQuantity }) => {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price?.toString().replace(/[^0-9.]/g, '')) || 0;
        return sum + price * (item.quantity || 1);
    }, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Cart Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[201] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 01-8 0" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Your Cart</h2>
                                    <p className="text-xs text-zinc-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                                </div>
                            </div>
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

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cart.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center py-20"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5">
                                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                                <line x1="3" y1="6" x2="21" y2="6" />
                                                <path d="M16 10a4 4 0 01-8 0" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-1">Cart is empty</h3>
                                        <p className="text-sm text-zinc-500">Add some products to get started</p>
                                    </motion.div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            key={item._id || item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                            className="group bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all"
                                        >
                                            <div className="flex gap-4">
                                                {/* Image */}
                                                <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Image</div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-white truncate mb-1">{item.title}</h4>
                                                    <p className="text-xs text-zinc-500 mb-2">{item.category || 'Product'}</p>
                                                    <p className="text-lg font-bold text-red-500">
                                                        {parseFloat(item.price?.toString().replace(/[^0-9.]/g, '')).toFixed(2)} KM
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-end justify-between">
                                                    <motion.button
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onRemove(item._id || item.id)}
                                                        className="text-zinc-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                        </svg>
                                                    </motion.button>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item._id || item.id, Math.max(1, (item.quantity || 1) - 1))}
                                                            className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-sm font-medium text-white w-6 text-center">{item.quantity || 1}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
                                                            className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Subtotal</span>
                                    <motion.span
                                        key={subtotal}
                                        initial={{ scale: 1.2, color: '#dc2626' }}
                                        animate={{ scale: 1, color: '#ffffff' }}
                                        className="text-2xl font-bold"
                                    >
                                        {subtotal.toFixed(2)} KM
                                    </motion.span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full btn-primary py-4 rounded-xl font-bold tracking-wider"
                                >
                                    <span>Checkout</span>
                                </motion.button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-sm text-zinc-500 hover:text-white transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;
