import { useState, useEffect } from 'react';
import { Menu, X, Home, ShoppingBag, Layers, Settings, ShoppingCart } from 'lucide-react';
import Background from './components/Background';
import BubblesLoader from './components/BubblesLoader';
import initialDatabase from './data/mockDatabase';
import HomeView from './views/HomeView';
import ProductGrid from './views/ProductGrid';
import CombinationsView from './views/CombinationsView';
import AdminView from './views/AdminView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrderConfirmationView from './views/OrderConfirmationView';
import { addToCart as addItemToCart, saveCartToLocalStorage, loadCartFromLocalStorage } from './cartManager';
import './App.css'

export default function App() {
  const [view, setView] = useState('home');
  const [db, setDb] = useState(initialDatabase);
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    setCart(savedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  // Simulate loading state on view change for the "bubble loading" requirement
  const handleNavigate = (newView) => {
    setSidebarOpen(false);
    setIsLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsLoading(false);
    }, 600);
  };

  const handleAddToCart = (item) => {
    setCart(addItemToCart(cart, item));
  };

  return (
    <>
      
      <div className="min-h-screen text-white flex">
        <Background />

        {/* --- SIDEBAR (Responsive Glass) --- */}
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <aside className={`
          fixed top-0 left-0 h-full z-50 glass-panel border-r border-white/10
          transition-all duration-500 ease-in-out
          flex flex-col py-8 group
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 lg:hover:w-64'}
        `}>
          <div className="flex items-center justify-between px-6 mb-12">
            <div className={`font-bold text-2xl tracking-wider truncate transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:hidden'}`}>
              GLASS
            </div>
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 px-4 overflow-hidden w-full">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'shirts', icon: Layers, label: 'Shirts' },
              { id: 'pants', icon: Layers, label: 'Pants' },
              { id: 'combinations', icon: ShoppingBag, label: 'Pairs' },
              { id: 'cart', icon: ShoppingCart, label: 'Cart' },
              { id: 'admin', icon: Settings, label: 'Data Update' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  flex items-center gap-4 p-3 rounded-2xl glass-button whitespace-nowrap
                  ${view === item.id ? 'bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
                `}
              >
                <item.icon size={24} className="shrink-0" />
                <span className={`font-semibold tracking-wide transition-all duration-300 ${!isSidebarOpen ? 'lg:hidden lg:opacity-0 lg:group-hover:inline-flex lg:group-hover:opacity-100' : ''}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0 lg:ml-20'} relative max-w-full overflow-x-hidden`}>
          
          {/* Header */}
          <header className="absolute top-0 w-full p-4 sm:p-6 flex justify-between items-center z-30">
            <button className="lg:hidden glass-button p-2 rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <button 
              onClick={() => handleNavigate('cart')}
              className="ml-auto glass-panel px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 text-sm sm:text-base hover:bg-white/10 transition"
            >
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              <span className="font-bold">{cart.length} Items</span>
            </button>
          </header>

          <div className="p-4 sm:p-6 md:p-12 pt-24 min-h-screen w-full">
            {isLoading ? (
              <BubblesLoader />
            ) : (
              <>
                {view === 'home' && <HomeView navigate={handleNavigate} db={db} />}
                {view === 'shirts' && <ProductGrid title="Premium Shirts" products={db.shirts} onAdd={handleAddToCart} />}
                {view === 'pants' && <ProductGrid title="Luxury Pants" products={db.pants} onAdd={handleAddToCart} />}
                {view === 'combinations' && <CombinationsView combinations={db.combinations} db={db} setDb={setDb} onAdd={handleAddToCart} />}
                {view === 'cart' && <CartView cart={cart} setCart={setCart} navigate={handleNavigate} />}
                {view === 'checkout' && <CheckoutView cart={cart} setCart={setCart} navigate={handleNavigate} />}
                {view === 'confirmation' && <OrderConfirmationView navigate={handleNavigate} />}
                {view === 'admin' && <AdminView db={db} setDb={setDb} />}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}


