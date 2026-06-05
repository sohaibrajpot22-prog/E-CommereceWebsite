import React from 'react';
import { Trash2, ArrowLeft, CreditCard, ShoppingBag, Plus, Minus } from 'lucide-react';

// Single FadeIn animation just for the whole blocks (no per-item delay lag)
const FadeIn = ({ children }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both w-full">
    {children}
  </div>
);

const CartView = ({ cart = [], removeFromCart, updateQuantity, emptyCart, navigate, onProductClick }) => {
  // Total calculate karte waqt quantity ko multiply zaroor karna hai
  const total = cart.reduce((sum, item) => sum + (parseInt(item.price || 0) * (item.cartQuantity || 1)), 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4">
      
      {/* Header Section */}
      <FadeIn>
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate && navigate('home')} className="hover:text-teal-400 transition text-[var(--text-muted)] p-2">
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-3xl sm:text-4xl font-black tracking-wide text-[var(--text-main)]">Your Cart</h2>
          </div>
          
          {/* NAYA BUTTON: Empty Cart */}
          {cart.length > 0 && (
            <button onClick={emptyCart} className="text-red-400 hover:text-red-500 font-bold text-sm flex items-center gap-1 bg-red-400/10 px-4 py-2 rounded-xl transition">
               <Trash2 size={16}/> Empty Cart
            </button>
          )}
        </div>
      </FadeIn>

      {cart.length === 0 ? (
        <FadeIn>
          <div className="glass-panel rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[40vh] border border-[var(--glass-border)] shadow-2xl">
            <div className="w-24 h-24 bg-[var(--glass-bg)] rounded-full flex items-center justify-center mb-2">
              <ShoppingBag size={40} className="text-[var(--text-muted)]" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Your cart is empty</h3>
              <p className="text-[var(--text-muted)] text-lg">Looks like you haven't added anything yet.</p>
            </div>
            <button onClick={() => navigate && navigate('shirts')} className="mt-4 bg-teal-500 text-slate-900 px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform text-lg shadow-lg">
              Start Shopping
            </button>
          </div>
        </FadeIn>
      ) : (
        /* FIXED LAYOUT: The main flex container */
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          
          {/* Left Side: Cart Items List */}
          <div className="flex-1 space-y-4">
            <FadeIn>
              {cart.map((item, idx) => (
                <div key={idx} className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden group border border-[var(--glass-border)] mb-4">
                  <div 
                    onClick={() => onProductClick && onProductClick(item)}
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-[var(--glass-border)] bg-[var(--bg-1)] cursor-pointer"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left cursor-pointer" onClick={() => onProductClick && onProductClick(item)}>
                    <h3 className="font-extrabold text-lg sm:text-2xl text-[var(--text-main)] truncate">{item.name}</h3>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                      {item.selectedSize && <span className="bg-[var(--glass-bg)] px-3 py-1 rounded-lg border border-[var(--glass-border)]">Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="bg-[var(--glass-bg)] px-3 py-1 rounded-lg border border-[var(--glass-border)]">Color: {typeof item.selectedColor === 'object' ? item.selectedColor.name : item.selectedColor}</span>}
                    </div>
                    
                    <p className="text-teal-400 font-black text-xl sm:text-2xl mt-3">RS {item.price}</p>
                  </div>
                  
                  {/* Plus / Minus Quantity & Delete Controls */}
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 bg-[var(--bg-1)] border border-[var(--glass-border)] rounded-full px-3 py-1.5">
                      <button onClick={() => updateQuantity(idx, -1)} className="hover:text-teal-400 text-[var(--text-muted)] transition"><Minus size={18}/></button>
                      <span className="font-bold text-[var(--text-main)] w-6 text-center">{item.cartQuantity || 1}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="hover:text-teal-400 text-[var(--text-muted)] transition"><Plus size={18}/></button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(idx)} 
                      className="p-3 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>

          {/* Right Side: Order Summary */}
          {/* CRITICAL FIX: shrink-0 makes sure it doesn't get squeezed or overflow the screen on mobile */}
          <div className="w-full lg:w-[340px] shrink-0">
            <FadeIn>
              <div className="glass-panel p-6 sm:p-8 rounded-[2.5rem] space-y-6 lg:sticky lg:top-28 border border-[var(--glass-border)] shadow-2xl">
                <h3 className="text-2xl font-black border-b border-[var(--glass-border)] text-[var(--text-main)] pb-4">Order Summary</h3>
                
                <div className="space-y-4 text-sm sm:text-base text-[var(--text-muted)] font-medium">
                  <div className="flex justify-between"><span>Subtotal</span> <span className="text-[var(--text-main)]">RS {total}</span></div>
                  <div className="flex justify-between"><span>Shipping</span> <span className="text-teal-400 font-bold">Free</span></div>
                </div>
                
                <div className="border-t border-[var(--glass-border)] pt-6 mt-6">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xl font-bold text-[var(--text-main)]">Total</span>
                    <span className="text-3xl font-black text-teal-400">RS {total}</span>
                  </div>
                  <button 
                    onClick={() => navigate && navigate('checkout')} 
                    className="w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 shadow-[0_10px_30px_rgba(45,212,191,0.3)] hover:shadow-[0_10px_40px_rgba(45,212,191,0.5)] hover:scale-105 transition-all"
                  >
                    <CreditCard size={22} /> Checkout
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartView;