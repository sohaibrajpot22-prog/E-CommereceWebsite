import React, { useState, useEffect } from 'react';
import { Menu, ShoppingCart, Mail } from 'lucide-react';
import Background from './components/Background';
import BubblesLoader from './components/BubblesLoader';
import Sidebar from './components/Sidebar'; 
import HomeView from './views/HomeView';
import ProductGrid from './views/ProductGrid';
import CombinationsView from './views/CombinationsView';
import SignInView from './views/SignInView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrderConfirmationView from './views/OrderConfirmationView';
import initialDatabase from './data/mockDatabase';
import AdminView from './views/AdminView';
import './App.css'; 

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 hover:text-teal-400 transition cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 hover:text-teal-400 transition cursor-pointer"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default function App() {
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [db, setDb] = useState(initialDatabase);
  
  // Cart state initialization
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('glass_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ visible: false, item: null });

  // Sync cart to local storage automatically
  useEffect(() => {
    localStorage.setItem('glass_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (item) => {
    setToast({ visible: true, item });
    setTimeout(() => setToast({ visible: false, item: null }), 3000);
  };

  const handleNavigate = (newView) => {
    setSidebarOpen(false);
    setSelectedProduct(null); 
    setIsLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsLoading(false);
    }, 400);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const addToCart = (item) => {
    if (!item) return;
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
    showToast(item);
  };

  const handleBuyNow = (item) => {
    if (!item) return;
    setCart(prev => [...prev, { ...item, cartId: Date.now() }]);
    showToast(item);
    handleNavigate('checkout');
  };

  const removeFromCart = (cartIdToRemove) => {
    setCart(cart.filter(item => item.cartId !== cartIdToRemove));
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden w-full relative">
      <Background />
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <Sidebar view={view} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} handleNavigate={handleNavigate} />

      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0 lg:ml-20'} relative w-full overflow-x-hidden flex flex-col`}>
        
        {/* Navbar */}
        <header className={`fixed top-0 right-0 z-30 glass-panel border-b border-[var(--glass-border)] px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center transition-all duration-500 ${isSidebarOpen ? 'w-full lg:w-[calc(100%-16rem)]' : 'w-full lg:w-[calc(100%-5rem)]'}`}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-xl hover:bg-[var(--glass-btn-hover)] text-[var(--text-main)]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
              <img src="https://placehold.co/100x100/2dd4bf/ffffff?text=GL" alt="Logo" className="w-8 h-8 rounded-lg shadow-md hidden sm:block" />
              <span className="font-extrabold text-xl tracking-widest text-[var(--text-main)]">GLASS</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[var(--text-main)]">
            <div className="hidden sm:flex items-center gap-4 text-[var(--text-muted)]">
              <FacebookIcon />
              <InstagramIcon />
            </div>
            <a href="#" className="text-[var(--text-muted)] hover:text-teal-400 flex items-center gap-1">
              <Mail size={20} /> <span className="hidden md:inline font-semibold">Contact</span>
            </a>

            <div className="h-6 w-px bg-[var(--glass-border)] mx-1"></div>

            {user ? (
              <div onClick={() => setUser(null)} className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer shadow-lg hover:ring-2 hover:ring-teal-300 transition-all">
                <span className="font-bold text-white text-xs">{user.nickname?.substring(0, 2).toUpperCase() || 'US'}</span>
              </div>
            ) : (
              <button onClick={() => handleNavigate('signin')} className="font-bold text-sm hover:text-teal-400 flex items-center gap-1">
                <UserIcon /> <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <div className="flex items-center gap-1 cursor-pointer hover:text-teal-400 transition-colors ml-1" onClick={() => handleNavigate('cart')}>
              <ShoppingCart size={24} />
              <span className="font-bold bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cart.length}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-12 pt-28 sm:pt-32 flex-1">
          {isLoading ? (
            <BubblesLoader />
          ) : selectedProduct ? (
            <ProductDetailView product={selectedProduct} onAdd={addToCart} onBuy={handleBuyNow} onBack={() => setSelectedProduct(null)} navigate={handleNavigate} user={user} />
          ) : (
            <>
              {/* YAHAN HUMNE user={user} ADD KIYA HAI */}
              {view === 'home' && <HomeView navigate={handleNavigate} db={db} onProductClick={handleProductClick} onAdd={addToCart} onBuy={handleBuyNow} user={user} />}
              {view === 'shirts' && <ProductGrid title="Premium Shirts" products={db.shirts} onProductClick={handleProductClick} onAdd={addToCart} onBuy={handleBuyNow} />}
              {view === 'pants' && <ProductGrid title="Luxury Pants" products={db.pants} onProductClick={handleProductClick} onAdd={addToCart} onBuy={handleBuyNow} />}
              {view === 'combinations' && <CombinationsView combinations={db.combinations} onProductClick={handleProductClick} onAdd={addToCart} onBuy={handleBuyNow} />}
              
              {/* YAHAN HUMNE cart, setCart, user, aur setDb THEEK SE PASS KAR DIYE HAIN */}
              {view === 'checkout' && <CheckoutView cart={cart} setCart={setCart} onProductClick={handleProductClick} navigate={handleNavigate} user={user} setDb={setDb} />}
              
              {view === 'confirmation' && <OrderConfirmationView navigate={handleNavigate} />}
              {view === 'signin' && <SignInView setUser={setUser} navigate={handleNavigate} />}
              {view === 'cart' && <CartView cartItems={cart} removeFromCart={removeFromCart} onProductClick={handleProductClick} navigate={handleNavigate} />}
              {view === 'admin' && <AdminView db={db} setDb={setDb} user={user} />}
            </>
          )}
        </div>
        
        {/* --- NAYA VIP GLOBAL TOAST POPUP --- */}
        {toast.visible && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 animate-in slide-in-from-top-10 fade-in zoom-in-95">
            <div className="glass-panel flex items-center gap-4 px-6 py-4 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-teal-400/50 shadow-[0_20px_50px_rgba(45,212,191,0.4)]">
              <div className="bg-gradient-to-tr from-teal-400 to-teal-300 text-slate-900 p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-extrabold text-[var(--text-main)] text-sm sm:text-base leading-none">Added to Cart!</span>
                <span className="text-teal-400 text-xs sm:text-sm font-bold mt-1 line-clamp-1">{toast.item?.name}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}