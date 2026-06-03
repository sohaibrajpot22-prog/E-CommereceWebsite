import React from 'react';
import { FadeIn } from '../components/FadeIn';
import { ChevronRight, Plus, ShoppingBag, Lock } from "lucide-react";

// YAHAN isLoggedIn KO HATA KAR user LIKH DIYA
const HomeView = ({ navigate, db, onProductClick, onAdd, onBuy, user }) => (
  <div className="flex flex-col w-full min-h-[80vh] justify-between">
    
    { }
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full mb-12 lg:mb-20">
      <div className="flex-1 space-y-6 sm:space-y-8 z-10 w-full text-center lg:text-left">
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-[var(--text-main)]">
            Reflect Your <br className="hidden sm:block lg:hidden"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">True Style</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-lg mx-auto lg:mx-0 font-light">
            Discover our exclusive collection of premium shirts and pants, designed with fluidity and modern aesthetics.
          </p>
        </FadeIn>
        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <button onClick={() => navigate('shirts')} className="w-full sm:w-auto justify-center glass-button px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg flex items-center gap-2 text-[var(--text-main)] hover:border-teal-400 transition-all">
              Shop Shirts <ChevronRight size={20} />
            </button>
            <button onClick={() => navigate('combinations')} className="w-full sm:w-auto justify-center bg-teal-500 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-teal-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              View Pairs
            </button>
          </div>
        </FadeIn>
      </div>
      
      { }
      <div className="flex-1 w-full relative hidden lg:flex justify-center items-center h-[550px]">
        <FadeIn delay={600}>
          {/* UPDATED: Increased size, reduced border, added onClick */}
          <div 
            onClick={() => onProductClick(db.combinations[0])}
            className="relative w-80 sm:w-96 h-[500px] sm:h-[550px] glass-panel rounded-[3rem] p-3 hero-product border border-[var(--glass-border)] shadow-2xl cursor-pointer hover:border-teal-400/50 transition-colors"
          >
            <img 
              src={db.combinations[0]?.image || 'https://placehold.co/400x600/083344/ffffff'} 
              alt="Featured" 
              className="w-full h-full object-cover rounded-[2.5rem]"
            />
            <div className="absolute bottom-8 left-8 right-8 glass-panel rounded-2xl p-4 flex justify-between items-center backdrop-blur-md">
              <div>
                <p className="font-bold text-lg text-[var(--text-main)]">{db.combinations[0]?.name || 'Featured Look'}</p>
                <p className="text-teal-400 font-extrabold">${db.combinations[0]?.price || '120'}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onAdd(db.combinations[0]); }} className="bg-teal-500 text-slate-900 p-3 rounded-xl hover:scale-110 transition-transform">
                 <Plus size={20} />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>

    {}
    <div className="w-full mb-12 lg:mb-20">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide border-b border-[var(--glass-border)] pb-2 sm:pb-4 inline-block mb-8 text-[var(--text-main)]">Trending Now</h2>
      </FadeIn>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {db.shirts.slice(0, 4).map((product, idx) => (
          <FadeIn key={product.id} delay={idx * 100}>
            <div className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-teal-400/40 transition-colors duration-300 flex flex-col h-full bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <div onClick={() => onProductClick(product)} className="aspect-[4/5] overflow-hidden relative cursor-pointer">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                <div onClick={() => onProductClick(product)} className="cursor-pointer">
                  <h3 className="font-bold text-sm sm:text-xl line-clamp-1 text-[var(--text-main)]">{product.name}</h3>
                  <p className="text-teal-400 font-bold text-sm sm:text-lg mt-1">${product.price}</p>
                </div>
                
                {/* UPDATED: Buttons resizing and stopping propagation */}
                <div className="flex gap-2 w-full mt-auto">
                   <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="flex-1 glass-button py-2 px-1 rounded-xl font-bold text-[10px] sm:text-sm whitespace-nowrap flex items-center justify-center gap-1 text-[var(--text-main)] hover:bg-teal-400/20 hover:text-teal-300 transition-colors">
                     <Plus size={14} className="sm:w-4 sm:h-4"/> Add
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); onBuy(product); }} className="flex-1 bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 py-2 px-1 rounded-xl font-bold text-[10px] sm:text-sm whitespace-nowrap flex items-center justify-center hover:shadow-lg transition-all">
                     Buy Now
                   </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>

    {/* --- Sign In Section --- */}
    {/* YAHAN !isLoggedIn KI JAGAH !user USE KIYA HAI */}
    {!user && (
      <FadeIn delay={800}>
        <div className="w-full glass-panel rounded-[2.5rem] p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="z-10 md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text-main)]">Join the Glass Club</h2>
            <p className="text-[var(--text-muted)] text-lg">Sign in to unlock exclusive drops and early access.</p>
          </div>
          <div className="z-10 md:w-1/2 w-full flex flex-col sm:flex-row gap-4 justify-end">
            <button onClick={() => navigate('signin')} className="glass-button bg-teal-500 text-slate-900 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg">
              Sign In <Lock size={18} />
            </button>
          </div>
        </div>
      </FadeIn>
    )}

    {/* --- Footer --- */}
    <FadeIn delay={400}>
      <footer className="w-full glass-panel rounded-3xl p-6 sm:p-8 mt-auto flex flex-col md:flex-row justify-between items-center text-[var(--text-muted)] gap-6 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-[var(--text-main)] tracking-widest">GLASS</h3>
          <p className="text-sm mt-1">Fluidity in fashion.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-semibold">
          <button onClick={() => navigate('shirts')} className="hover:text-teal-400 transition">Shirts</button>
          <button onClick={() => navigate('pants')} className="hover:text-teal-400 transition">Pants</button>
          <button onClick={() => navigate('combinations')} className="hover:text-teal-400 transition">Pairs</button>
          <button onClick={() => navigate('cart')} className="hover:text-teal-400 transition">Cart</button>
          <button onClick={() => navigate('signin')} className="hover:text-teal-400 transition">Sign In</button>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-teal-400 transition"><ShoppingBag size={20} /></a>
          <a href="#" className="hover:text-teal-400 transition"><Lock size={20} /></a>
        </div>
        <div className="text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} Glass Apparel.<br className="hidden md:block" /> All rights reserved.
        </div>
      </footer>
    </FadeIn>
  </div>
);

export default HomeView;