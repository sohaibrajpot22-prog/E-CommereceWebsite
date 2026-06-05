import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, Star, ShieldCheck, Info, X, Edit3, ImagePlus } from "lucide-react";



// 1. YAHAN PROPS UPDATE KAREIN (onAdd, onBuy aur propProduct receive karein)
const ProductDetailsView = ({ product: propProduct, navigate, db, onAdd, onBuy, isLoggedIn = false, userNickname = '', user }) => {
  const safeNavigate = (path) => {
    if(typeof navigate === 'function') {
        navigate(path);
    } else {
        console.warn("Navigation function is missing!");
    }
  }

  // 2. DUMMY PRODUCT KI JAGAH ASLI CLICKED PRODUCT USE KAREIN
  const product = propProduct || {
    id: 1,
    name: "Classic Oxford Blue",
    price: "45",
    description: "Experience the ultimate comfort and premium aesthetics with our Classic Oxford shirt.",
    image: "https://placehold.co/600x800/0f172a/ffffff",
    colors: ["Blue", "Navy", "White"],
    sizes: ["S", "M", "L", "XL"],
    quantity: 15 
  };

  const [selectedSize, setSelectedSize] = useState(product.sizes[1] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [mainImage, setMainImage] = useState(product.image);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Professional Image Gallery Logic
  const gallery = [
    product.image, 
    "https://placehold.co/600x800/083344/ffffff?text=Fabric+Detail", 
    "https://placehold.co/600x800/1e293b/ffffff?text=Model+View"
  ];

  // 3. ADD TO CART AUR BUY NOW KO UPDATE KAREIN
  const handleAddToCart = () => {
    if(product.quantity === 0) return;
    if(typeof onAdd === 'function') {
      // App.jsx wala function call hoga, jo Toast aur Cart dono ko automatically update karega!
      onAdd({ ...product, selectedSize, selectedColor, cartQuantity: 1 });
    }
  };

  const handleBuyNow = () => {
    if(product.quantity === 0) return;
    if(typeof onBuy === 'function') {
      onBuy({ ...product, selectedSize, selectedColor, cartQuantity: 1 });
    }
  };

  const similarProducts = [
    { id: 2, name: "Ocean Breathe Tee", price: "30", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 3, name: "Crystal Button-Up", price: "60", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 4, name: "Frosted Polo", price: "40", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 5, name: "Deep Sea Chinos", price: "55", image: "https://placehold.co/400x500/020617/ffffff" }
  ];

  return (
    <div className="w-full min-h-screen pb-20 pt-4 sm:pt-8 px-3 sm:px-8 max-w-7xl mx-auto flex flex-col relative">
      <button onClick={() => safeNavigate('home')} className="flex items-center gap-1 sm:gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-4 sm:mb-8 text-sm sm:text-base font-medium">
        <ChevronLeft size={18} /> Back to Products
      </button>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-16">
        
        {/* --- LEFT SIDE: IMAGE GALLERY --- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
           
            <div className="relative w-full aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-4 glass-panel border border-[var(--glass-border)] shadow-2xl overflow-hidden group">
              <img 
                src={mainImage} 
                alt={product.name} 
                className={`w-full h-full object-cover rounded-[1.5rem] sm:rounded-[2rem] transition-transform duration-700 ${product.quantity === 0 ? 'grayscale opacity-60' : ''}`}
              />
              {product.quantity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-red-500/90 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl border-2 border-red-200/50 transform -rotate-12 font-black text-2xl sm:text-5xl tracking-widest shadow-2xl backdrop-blur-md">SOLD OUT</div>
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 mt-4 custom-scrollbar">
              {gallery.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  onClick={() => setMainImage(img)}
                  alt={`View ${idx + 1}`} 
                  className={`w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl sm:rounded-2xl cursor-pointer border-2 transition-all shrink-0 ${mainImage === img ? 'border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
           
        </div>

        {/* --- RIGHT SIDE: PRODUCT DETAILS --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
         
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-yellow-400/20">
                <Star size={14} fill="currentColor" className="sm:w-4 sm:h-4" /> 4.9
              </div>
              {product.quantity > 0 && product.quantity <= 5 && (
                <div className="text-red-400 text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 animate-pulse bg-red-400/10 px-2 sm:px-3 py-1 rounded-full border border-red-400/20">
                  Hurry up! Only {product.quantity} left
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold sm:font-extrabold text-[var(--text-main)] mb-1 sm:mb-2 leading-tight">{product.name}</h1>
            <p className="text-2xl sm:text-4xl font-bold sm:font-black text-teal-400 mb-3 sm:mb-6">RS {product.price}</p>
            <p className="text-sm sm:text-lg font-light leading-relaxed mb-4 sm:mb-8 text-[var(--text-muted)]">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-6 sm:mb-8">
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)] mb-3 flex items-center justify-between">
                Color: <span className="text-teal-400 font-medium">{selectedColor.name || selectedColor}</span>
              </h3>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.colors?.map(color => {
                    const colorName = color.name || color;
                    return (
                  <button 
                    key={colorName}
                    onClick={() => product.quantity > 0 && setSelectedColor(color)}
                    disabled={product.quantity === 0}
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border-2 font-bold text-xs sm:text-base transition-all ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${selectedColor === color || selectedColor.name === colorName ? 'border-teal-400 bg-teal-400/10 text-teal-400' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:border-teal-400/50'}`}
                  >
                    {colorName}
                  </button>
                )})}
              </div>
            </div>

            {/* Size Selection with Size Guide */}
            <div className="mb-8 sm:mb-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)]">
                  Size: <span className="text-teal-400 font-medium">{selectedSize}</span>
                </h3>
                <button onClick={() => setShowSizeGuide(true)} className="text-teal-400 text-xs sm:text-sm font-bold flex items-center gap-1 hover:text-teal-300 transition-colors">
                  <Info size={16} /> Size Guide
                </button>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.sizes?.map(size => (
                  <button 
                    key={size}
                    onClick={() => product.quantity > 0 && setSelectedSize(size)}
                    disabled={product.quantity === 0}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center transition-all ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${selectedSize === size ? 'border-teal-400 bg-teal-400/10 text-teal-400' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:border-teal-400/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 sm:gap-4 w-full">
              <button 
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg flex items-center justify-center gap-2 transition-all ${product.quantity === 0 ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'glass-button text-[var(--text-main)] hover:bg-teal-500/10 hover:border-teal-400/50'}`}
              >
                <ShoppingCart size={20} className="shrink-0" /> Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl font-extrabold text-sm sm:text-lg flex items-center justify-center transition-all ${product.quantity === 0 ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]'}`}
              >
                Buy Now
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium">
              <ShieldCheck size={18} className="text-teal-400" /> 100% Original Products | Free Shipping
            </div>

            {/* --- ADMIN EDIT SECTION --- */}
            {user?.role === 'admin' && (
              <div className="mt-8 p-5 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex flex-col gap-3">
                <p className="text-teal-400 font-bold text-sm flex items-center gap-2">
                  <ShieldCheck size={16} /> Admin Controls
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="text-xs sm:text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2 rounded-xl text-[var(--text-main)] hover:text-teal-400 hover:border-teal-400 flex items-center gap-2 transition-all">
                    <Edit3 size={14} /> Edit Description
                  </button>
                  <button className="text-xs sm:text-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2 rounded-xl text-[var(--text-main)] hover:text-teal-400 hover:border-teal-400 flex items-center gap-2 transition-all">
                    <ImagePlus size={14} /> Add/Remove Images
                  </button>
                </div>
              </div>
            )}
           
        </div>
      </div>

      {/* --- SIZE GUIDE MODAL --- */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] max-w-2xl w-full relative border border-teal-500/30 shadow-2xl animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSizeGuide(false)} className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-teal-400 bg-white/5 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-6">Size Guide</h2>
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-white/5">
              {/* Dummy Image for Admin to change later */}
              <img src="https://placehold.co/800x450/083344/ffffff?text=Official+Size+Chart" alt="Size Chart" className="w-full h-full object-cover" />
            </div>
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-6 text-center bg-white/5 py-3 rounded-xl border border-white/10">
              Measurements are shown in inches. Need help? <a href="#" className="text-teal-400 font-bold hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsView;