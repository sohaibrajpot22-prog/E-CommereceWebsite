import React, { useState, useEffect } from 'react';

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

const CombinationsView = ({ combinations, onProductClick, onAdd, onBuy }) => {
  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/20 pb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-wide inline-block">Curated Pairs</h2>
            <p className="text-[var(--text-muted)] mt-2 text-base sm:text-lg">Perfectly matched shirts and pants.</p>
          </div>
        </div>
      </FadeIn>
      
      {/* Pairs grid updated to look like standard product boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-8">
        {combinations.map((combo, idx) => (
          <FadeIn key={combo.id} delay={idx * 100}>
            <div 
              onClick={() => onProductClick(combo)}
              className="glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 group hover:border-teal-400/40 transition duration-500 cursor-pointer h-full items-stretch"
            >
              {/* UPDATED: Border 2 removed, size and aspect ratio adjusted for better fit */}
              <div className="w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:min-h-[200px] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-[var(--glass-border)]">
                 <img 
                  src={combo.image} 
                  alt={combo.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="w-full sm:w-3/5 flex flex-col justify-center py-1 sm:py-2">
                <h3 className="text-xl sm:text-2xl font-bold line-clamp-2 text-[var(--text-main)]">{combo.name}</h3>
                <p className="text-lg sm:text-xl text-teal-400 font-bold mt-1">${combo.price}</p>
                
                <div className="space-y-1 text-[var(--text-muted)] text-xs sm:text-sm mt-3 mb-4">
                  <p className="flex items-center gap-1">✓ Premium Shirt</p>
                  <p className="flex items-center gap-1">✓ Luxury Pants</p>
                  <p className="flex items-center gap-1 text-teal-400">✓ 15% Discount Applied</p>
                </div>
                
                {/* UPDATED: mt-auto pushes buttons to bottom, responsive text ensures no wrapping issues */}
                <div className="mt-auto pt-2 flex gap-2 w-full">
                  <button onClick={(e) => { e.stopPropagation(); onAdd && onAdd(combo); }} className="flex-1 whitespace-nowrap text-[11px] sm:text-xs md:text-sm glass-button py-2.5 px-2 rounded-xl font-bold transition-colors hover:bg-teal-400/20 hover:text-teal-300">
                    Add to Cart
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onBuy && onBuy(combo); }} className="flex-1 whitespace-nowrap text-[11px] sm:text-xs md:text-sm bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 py-2.5 px-2 rounded-xl font-extrabold hover:shadow-lg transition-all">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default CombinationsView;