import { Plus } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export const ProductGrid = ({ title, products, onAdd }) => (
  <div className="space-y-6 sm:space-y-8 w-full">
    <FadeIn>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-wide border-b border-white/20 pb-2 sm:pb-4 inline-block">{title}</h2>
    </FadeIn>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 auto-rows-fr">
      {products.map((product, idx) => (
        <FadeIn key={product.id} delay={idx * 100}>
          <div className="glass-panel rounded-[2rem] overflow-hidden group hover:border-white/40 hover:shadow-[0_25px_50px_-30px_rgba(255,255,255,0.8)] transition-all duration-300 flex flex-col h-full">
            <div className="relative overflow-hidden aspect-[4/5] bg-white/5">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-2xl tracking-tight">{product.name}</h3>
                <p className="text-teal-300 font-semibold text-xl">${product.price}</p>
              </div>
              <button 
                onClick={() => onAdd(product)}
                className="w-full glass-button py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base bg-teal-500/15 hover:bg-teal-500/35 border border-teal-300/20 text-teal-100 transition"
              >
                <Plus size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  </div>
);
export default ProductGrid;