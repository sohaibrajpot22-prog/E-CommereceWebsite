import React from 'react';
import { Plus } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

const ProductGrid = ({ title, products, onProductClick, onAdd, onBuy }) => (
  <div className="space-y-6 sm:space-y-8 w-full">
    <FadeIn>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-wide border-b border-[var(--glass-border)] pb-2 sm:pb-4 inline-block text-[var(--text-main)]">{title}</h2>
    </FadeIn>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
      {products.map((product, idx) => (
        <FadeIn key={product.id} delay={idx * 50}>
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
              
              {/* UPDATED: Buttons Layout */}
              <div className="flex gap-2 w-full mt-auto">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onAdd(product); }} 
                    className="flex-1 glass-button py-2 px-1 sm:px-2 rounded-xl font-bold text-[10px] sm:text-sm whitespace-nowrap flex items-center justify-center gap-1 text-[var(--text-main)] hover:bg-teal-400/20 transition-all"
                 >
                   <Plus size={14} className="sm:w-4 sm:h-4"/> <span className="hidden sm:inline">Add</span><span className="sm:hidden">+</span>
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onBuy(product); }} 
                    className="flex-1 bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 py-2 px-1 sm:px-2 rounded-xl font-bold text-[10px] sm:text-sm whitespace-nowrap flex items-center justify-center hover:shadow-lg transition-all"
                 >
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

export default ProductGrid;