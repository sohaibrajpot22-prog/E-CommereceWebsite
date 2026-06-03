import React, { useState, useEffect } from 'react';
import { Trash2, ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div className={`transition-all duration-700 ease-out w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  );
};

const CartView = ({ cart = [], removeFromCart, navigate, onProductClick }) => {
  const total = cart.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

  // YEH FUNCTION AAPKE ERROR KO ROKEGA!
  // Agar color object hai toh uska 'name' nikalega, warna waise hi print karega
  const getSafeColorName = (color) => {
    if (!color) return 'Default';
    if (typeof color === 'object') return color.name || 'Default';
    return color;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4">
      <FadeIn>
        <div className="flex items-center gap-4 border-b border-[var(--glass-border)] pb-4">
          <button onClick={() => navigate && navigate('home')} className="hover:text-teal-400 transition text-[var(--text-muted)] p-2">
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-3xl sm:text-4xl font-black tracking-wide text-[var(--text-main)]">Your Cart</h2>
        </div>
      </FadeIn>

      {cart.length === 0 ? (
        <FadeIn delay={100}>
          <div className="glass-panel rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[40vh] border border-[var(--glass-border)] shadow-2xl">
            <div className="w-24 h-24 bg-[var(--glass-bg)] rounded-full flex items-center justify-center mb-2 border border-[var(--glass-border)] shadow-inner">
              <ShoppingBag size={40} className="text-[var(--text-muted)]" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Your cart is empty</h3>
              <p className="text-[var(--text-muted)] text-lg">Looks like you haven't added any premium apparel yet.</p>
            </div>
            <button onClick={() => navigate && navigate('shirts')} className="mt-4 bg-[var(--text-main)] text-[var(--bg-1)] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform text-lg shadow-lg">
              Start Shopping
            </button>
          </div>
        </FadeIn>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            {cart.map((item, idx) => (
              <FadeIn key={item.cartId || idx} delay={idx * 100}>
                <div className="glass-panel p-4 sm:p-5 rounded-3xl flex items-center gap-4 sm:gap-6 relative overflow-hidden group border border-[var(--glass-border)] hover:border-teal-400/30 transition-all shadow-lg">
                  
                  {/* Image */}
                  <div 
                    onClick={() => onProductClick && onProductClick(item)} 
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 cursor-pointer border border-[var(--glass-border)] bg-[var(--bg-1)]"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-12 cursor-pointer" onClick={() => onProductClick && onProductClick(item)}>
                    <h3 className="font-extrabold text-lg sm:text-2xl text-[var(--text-main)] truncate group-hover:text-teal-400 transition-colors">{item.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                      {item.selectedSize && <span className="bg-[var(--glass-bg)] px-3 py-1 rounded-lg border border-[var(--glass-border)]">Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="bg-[var(--glass-bg)] px-3 py-1 rounded-lg border border-[var(--glass-border)]">Color: {getSafeColorName(item.selectedColor)}</span>}
                    </div>
                    
                    <p className="text-teal-400 font-black text-xl sm:text-2xl mt-3">${item.price}</p>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFromCart(idx); }} 
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <FadeIn delay={300} className="w-full lg:w-96 shrink-0">
            <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] space-y-6 sticky top-28 border border-[var(--glass-border)] shadow-2xl">
              <h3 className="text-2xl font-black border-b border-[var(--glass-border)] text-[var(--text-main)] pb-4">Order Summary</h3>
              
              <div className="space-y-4 text-sm sm:text-base text-[var(--text-muted)] font-medium">
                <div className="flex justify-between"><span>Subtotal</span> <span className="text-[var(--text-main)]">${total}</span></div>
                <div className="flex justify-between"><span>Shipping</span> <span className="text-teal-400 font-bold">Free</span></div>
                <div className="flex justify-between"><span>Taxes</span> <span className="text-[var(--text-main)]">$0</span></div>
              </div>
              
              <div className="border-t border-[var(--glass-border)] pt-6 mt-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-[var(--text-main)]">Total</span>
                  <span className="text-4xl font-black text-teal-400">${total}</span>
                </div>
                <button 
                  onClick={() => navigate && navigate('checkout')} 
                  className="w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 shadow-[0_10px_30px_rgba(45,212,191,0.3)] hover:shadow-[0_10px_40px_rgba(45,212,191,0.5)] hover:scale-105 transition-all"
                >
                  <CreditCard size={22} /> Proceed to Checkout
                </button>
              </div>
            </div>
          </FadeIn>

        </div>
      )}
    </div>
  );
};

export default CartView;