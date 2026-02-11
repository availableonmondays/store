import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import Header from './components/Header';
import Hero from './components/Hero';
import Offers from './components/Offers';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('gemeos_is_admin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Convex
  const offers = useQuery(api.products.get) || [];
  const addProduct = useMutation(api.products.add);
  const deleteProduct = useMutation(api.products.remove);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('gemeos_categories');
    return saved ? JSON.parse(saved) : ['Gaming', 'Keyboards', 'Mice', 'Headsets'];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gemeos_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gemeos_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gemeos_categories', JSON.stringify(categories));
  }, [categories]);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowAdmin(true);
    localStorage.setItem('gemeos_is_admin', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdmin(false);
    localStorage.removeItem('gemeos_is_admin');
  };

  const addOffer = async (offer) => {
    try {
      await addProduct({
        title: offer.title || '',
        description: offer.description || '',
        shortDescription: offer.shortDescription || '',
        price: parseFloat(offer.price) || 0,
        originalPrice: parseFloat(offer.originalPrice) || 0,
        image: offer.image || '',
        category: offer.category || '',
        specs: offer.specs || '',
        warranty: offer.warranty || '',
        rating: parseFloat(offer.rating) || 5,
        stockStatus: offer.stockStatus || 'In Stock',
        isHotDeal: offer.isHotDeal || false,
      });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const deleteOffer = async (id) => {
    try {
      await deleteProduct({ id });
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Cart
  const addToCart = (product) => {
    setCart(prev => {
      const productId = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === productId);
      if (existing) {
        return prev.map(item =>
          (item._id || item.id) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          (item._id || item.id) === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Handle product click from search
  const handleProductClick = (product) => {
    setSearchQuery('');
    // Scroll to offers section, the modal will open from Offers
    const el = document.getElementById('offers');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header
        onLoginClick={() => isAdmin ? setShowAdmin(true) : setShowLogin(true)}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero
          offers={offers}
          onProductClick={handleProductClick}
        />
        <Offers
          offers={offers}
          categories={categories}
          onAddToCart={addToCart}
          searchQuery={searchQuery}
        />
      </main>

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <AnimatePresence>
        {showLogin && (
          <LoginModal
            key="login-modal"
            onLogin={handleLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && (
          <AdminPanel
            key="admin-panel"
            offers={offers}
            categories={categories}
            onAddOffer={addOffer}
            onDeleteOffer={deleteOffer}
            onUpdateCategories={setCategories}
            onClose={() => setShowAdmin(false)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <footer className="bg-[#030303] py-16 border-t border-white/5">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/gemeos-logo.png" alt="Gemeos" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-white tracking-tight">GEMEOS</span>
          </div>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Premium Gaming & Electronics</p>

          {/* Trust Footer */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs text-zinc-500">
            <span>🛡️ 2-Year Warranty</span>
            <span>💰 Cash on Delivery</span>
            <span>📍 Sarajevo</span>
            <span>✅ Official Distributor</span>
          </div>

          <p className="text-xs text-zinc-700">© 2026 Gemeos Gaming. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
