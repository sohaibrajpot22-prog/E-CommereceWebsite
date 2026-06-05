import React, { useState, useEffect } from 'react';
import { Menu, ShoppingCart, Mail, Search, X, LogOut, Package, ChevronRight } from 'lucide-react';
import { auth, dbFirestore } from './firebase'; // dbFirestore add karein
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import TrackOrderView from './views/TrackOrderView';
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
import AdminView from './views/AdminView';
import initialDatabase from './data/mockDatabase';
import MyOrdersView from './views/MyOrdersView';
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

  // Yeh code App.jsx mein paste karein
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User logged in hai, database se uska role bhi mangwao
        const userDoc = await getDoc(doc(dbFirestore, "users", currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : { role: 'customer' };
        
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          uid: currentUser.uid,
          role: userData.role
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  // Cart state with LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('glass_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth State & Toast
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ visible: false, item: null });

  // Phase 2: Search States & Logout Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('glass_cart', JSON.stringify(cart));
  }, [cart]);

  // Live Search Logic
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    // 1. Sab products ko ek list mein jama karein
    const allProducts = [
      ...(db.shirts || []), 
      ...(db.pants || []), 
      ...(db.combinations || [])
    ];

    const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.name, item])).values());

    const results = uniqueProducts.filter(item => 
      item.name.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
  }, [searchQuery, db]);

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
      window.scrollTo(0, 0);
      setIsLoading(false);
    }, 400);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  // Cart Functions
  const addToCart = (item) => {
    if (!item || !item.id) return;
    const exists = cart.some(c => c.id === item.id);
    if (!exists) {
      setCart(prev => [...prev, item]);
    }
    showToast(item);
  };

  const handleBuyNow = (item) => {
    if (!item || !item.id) return;
    addToCart(item);
    setTimeout(() => handleNavigate('checkout'), 100);
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const newCart = [...prev];
      const updatedItem = { ...newCart[index] };
      updatedItem.cartQuantity = (updatedItem.cartQuantity || 1) + delta;
      
      if (updatedItem.cartQuantity <= 0) {
        return newCart.filter((_, i) => i !== index);
      }
      newCart[index] = updatedItem;
      return newCart;
    });
  };

  const emptyCart = () => setCart([]);

  const removeFromCart = (indexToRemove) => {
    setCart(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Logout Function
  const handleLogout = () => {
    setUser(null);
    setShowLogoutConfirm(false);
    handleNavigate('home');
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden w-full relative">
      <Background />
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      
      <Sidebar view={view} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} handleNavigate={handleNavigate} user={user} />
      <main className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0 lg:ml-20'} relative w-full flex flex-col min-h-screen transition-all duration-500`}>
        
        {/* FIXED TOP NAVBAR */}
        <header className={`fixed top-0 right-0 z-30 glass-panel border-b border-[var(--glass-border)] px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center transition-all duration-500 ${isSidebarOpen ? 'w-full lg:w-[calc(100%-16rem)]' : 'w-full lg:w-[calc(100%-5rem)]'}`}>
          
          <div className="flex items-center gap-4 shrink-0">
            <button className="lg:hidden p-1 rounded-xl hover:bg-white/10 text-[var(--text-main)]" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
              <img src="https://placehold.co/100x100/2dd4bf/ffffff?text=VC" alt="Logo" className="w-8 h-8 rounded-lg shadow-md" />
              <span className="font-extrabold text-xl sm:text-2xl tracking-widest hidden sm:block text-[var(--text-main)]">VINTAGE</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1 sm:p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--text-main)]"
              title="Search Products"
            >
              <Search size={20} className="sm:w-6 sm:h-6" />
            </button>

            <div className="hidden md:flex items-center gap-4 text-[var(--text-muted)]">
              <FacebookIcon />
              <InstagramIcon />
              <a href="#" className="hover:text-teal-400 flex items-center gap-1"><Mail size={18} /> Contact</a>
            </div>

            <div className="h-5 w-px bg-[var(--glass-border)] hidden sm:block"></div>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="flex items-center gap-3">
                
                <button onClick={() => handleNavigate('myorders')} className="hidden sm:flex text-sm font-bold text-[var(--text-muted)] hover:text-teal-400 items-center gap-1 transition-colors">
                   <Package size={18} /> My Orders
                </button>
                {/* Profile Icon opens Logout Confirmation */}
                <div onClick={() => setShowLogoutConfirm(true)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer shadow-lg shrink-0 hover:bg-teal-400 transition-colors" title="Profile">
                  <span className="font-bold text-slate-900 text-sm">{user.name?.substring(0, 2).toUpperCase() || 'US'}</span>
                </div>
              </div>
            ) : (
              <button onClick={() => handleNavigate('signin')} className="font-bold text-sm sm:text-base hover:text-teal-400 flex items-center gap-1 shrink-0 text-[var(--text-main)]">
                <UserIcon /> <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Icon */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-teal-400 shrink-0 ml-2 text-[var(--text-main)]" onClick={() => handleNavigate('cart')}>
              <ShoppingCart size={22} />
              <span className="font-bold bg-teal-500 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-xs">{cart.length}</span>
            </div>
          </div>
        </header>
        <div className="h-20 sm:h-24"></div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] max-w-sm w-full relative animate-in zoom-in duration-200 border border-[var(--glass-border)]">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} />
              </div>
              <h3 className="text-2xl font-bold text-center text-[var(--text-main)] mb-2">Sign Out</h3>
              <p className="text-center text-[var(--text-muted)] mb-6">Are you sure you want to sign out of your account?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-[var(--text-main)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] bg-[var(--bg-1)]/95 backdrop-blur-xl flex flex-col pt-20 px-4 sm:px-10 pb-10 overflow-hidden animate-in fade-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="absolute top-6 right-6 p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full text-[var(--text-muted)] hover:text-teal-400 hover:border-teal-400 hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all"
            >
              <X size={24} />
            </button>

            <div className="max-w-3xl mx-auto w-full flex flex-col h-full mt-4">
              {/* Search Input */}
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-400" size={28} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for shirts, pants, styles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] focus:border-teal-400 text-[var(--text-main)] text-xl sm:text-2xl focus:outline-none shadow-2xl transition-all"
                />
              </div>

              {/* Search Results Area - UPDATED GAP & PADDING */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {searchQuery.length > 0 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                            handleProductClick(item);
                          }}
                          className="flex items-center gap-4 sm:gap-6 bg-[var(--glass-bg)] p-4 sm:p-5 rounded-3xl border border-[var(--glass-border)] hover:border-teal-400/50 cursor-pointer transition-all hover:bg-teal-400/5 group"
                        >
                          <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl shrink-0 border border-[var(--glass-border)]" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-[var(--text-main)] text-lg sm:text-2xl truncate group-hover:text-teal-400 transition-colors">{item.name}</h4>
                            <p className="text-[var(--text-muted)] text-sm sm:text-base line-clamp-1 mt-1">{item.description}</p>
                            <p className="text-teal-400 font-bold text-base sm:text-lg mt-2">RS {item.price}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[var(--glass-btn)] flex items-center justify-center group-hover:bg-teal-400 group-hover:text-slate-900 transition-colors shrink-0">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-[var(--text-muted)] py-20 flex flex-col items-center">
                       <Search size={64} className="mb-4 opacity-20" />
                      <p className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">No products found</p>
                      <p className="mt-2">Try searching for something else like "Oxford" or "Chinos".</p>
                    </div>
                  )
                ) : (
                  <div className="text-center text-[var(--text-muted)] py-20 flex flex-col items-center opacity-50">
                    <Search size={80} className="mb-6 opacity-30" />
                    <p className="text-2xl font-bold">What are you looking for?</p>
                    <p className="mt-2 text-lg">Start typing to explore our premium collection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-12 pt-28 sm:pt-32 flex-1">
          {isLoading ? (
            <BubblesLoader />
          ) : selectedProduct ? (
            <ProductDetailView product={selectedProduct} onAdd={addToCart} onBuy={handleBuyNow} onBack={() => setSelectedProduct(null)} navigate={handleNavigate} user={user} />
          ) : (
            <>
              {view === 'home' && <HomeView navigate={handleNavigate} db={db} onAdd={addToCart} onBuy={handleBuyNow} onProductClick={handleProductClick} user={user} />}
              {view === 'shirts' && <ProductGrid title="Premium Shirts" products={db.shirts} onAdd={addToCart} onBuy={handleBuyNow} onProductClick={handleProductClick} />}
              {view === 'pants' && <ProductGrid title="Luxury Pants" products={db.pants} onAdd={addToCart} onBuy={handleBuyNow} onProductClick={handleProductClick} />}
              {view === 'combinations' && <CombinationsView combinations={db.combinations} onProductClick={handleProductClick} onAdd={addToCart} onBuy={handleBuyNow} />}
              {view === 'checkout' && <CheckoutView cartItems={cart} setCartItems={setCart} navigate={handleNavigate} setDb={setDb} user={user} />}
              {view === 'confirmation' && <OrderConfirmationView navigate={handleNavigate} />}
              {view === 'signin' && <SignInView setUser={setUser} navigate={handleNavigate} />}
              {view === 'cart' && <CartView cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} emptyCart={emptyCart} navigate={handleNavigate} onProductClick={handleProductClick} />}
              {view === 'admin' && <AdminView db={db} setDb={setDb} />}
              {view === 'track' && <TrackOrderView navigate={handleNavigate} />}
              {view === 'myorders' && <MyOrdersView navigate={handleNavigate} user={user} />}
              
            </>
          )}
        </div>

        {/* Global Premium Toast */}
        {toast.visible && (
  <div 
    className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ease-out"
    style={{ 
      animation: "slideDown 0.5s ease-out forwards" 
    }}
  >
    {/* Inline Style for the animation to avoid external CSS files */}
    <style>{`
      @keyframes slideDown {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    <div className="glass-panel flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--glass-bg)] border border-teal-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md pointer-events-auto">
      
      {/* Icon */}
      <div className="bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 p-1.5 rounded-full shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      {/* Text */}
      <span className="font-bold text-[var(--text-main)] text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-teal-400">{toast.item?.name}</span> added to cart!
      </span>
      
    </div>
  </div>
)}
      </main>
    </div>
  );
}