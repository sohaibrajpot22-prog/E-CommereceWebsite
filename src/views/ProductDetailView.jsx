import { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, Check, Star, ShieldCheck, MessageCircle, Send } from "lucide-react";

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

const ProductDetailsView = ({ navigate, db, isLoggedIn = false, userNickname = '' }) => {
  // Safe navigation incase prop is missing
  const safeNavigate = (path) => {
    if(typeof navigate === 'function') {
        navigate(path);
    } else {
        console.warn("Navigation function is missing!");
    }
  }

  // Dummy product, normally fetched from DB via ID
  const product = {
    id: 1,
    name: "Classic Oxford Blue",
    price: "45",
    description: "Experience the ultimate comfort and premium aesthetics with our Classic Oxford shirt. Tailored for a perfect modern fit.",
    image: "https://placehold.co/600x800/0f172a/ffffff",
    colors: ["Blue", "Navy", "White"],
    sizes: ["S", "M", "L", "XL"],
    quantity: 15 
  };

  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showToast, setShowToast] = useState(false);

  const similarProducts = [
    { id: 2, name: "Ocean Breathe Tee", price: "30", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 3, name: "Crystal Button-Up", price: "60", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 4, name: "Frosted Polo", price: "40", image: "https://placehold.co/400x500/0f172a/ffffff" },
    { id: 5, name: "Deep Sea Chinos", price: "55", image: "https://placehold.co/400x500/020617/ffffff" }
  ];

  const [reviews, setReviews] = useState([
    { id: 1, user: "Sohaib", rating: 5, text: "Amazing quality, feels very premium!" },
    { id: 2, user: "Ahmed", rating: 4, text: "Great fit, stylish design." }
  ]);
  const [newReview, setNewReview] = useState({ text: '', rating: 5 });


  const handleAddToCart = () => {
    if(product.quantity === 0) return;
    
    try {
      const cart = JSON.parse(localStorage.getItem('glass_cart') || '[]');
      const newItem = { ...product, selectedSize, selectedColor, cartQuantity: 1 };
      cart.push(newItem);
      localStorage.setItem('glass_cart', JSON.stringify(cart));
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch(e) {
      console.error("Cart save error", e);
    }
  };

  const handleBuyNow = () => {
    if(product.quantity === 0) return;
    
    try {
      const cart = JSON.parse(localStorage.getItem('glass_cart') || '[]');
      const newItem = { ...product, selectedSize, selectedColor, cartQuantity: 1 };
      cart.push(newItem);
      localStorage.setItem('glass_cart', JSON.stringify(cart));
      
      safeNavigate('cart');
    } catch(e) {
      console.error("Cart save error", e);
    }
  };
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.text) return;
    setReviews([...reviews, { ...newReview, user: userNickname, id: Date.now() }]);
    setNewReview({ text: '', rating: 5 });
  };


  return (
    <div className="w-full min-h-screen pb-20 pt-4 sm:pt-8 px-3 sm:px-8 max-w-7xl mx-auto flex flex-col relative">
      
      {/* --- TOAST NOTIFICATION --- */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90 pointer-events-none'}`}>
        <div className="glass-panel flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-[var(--glass-bg)] border border-teal-400 shadow-[0_10px_40px_rgba(45,212,191,0.2)]">
          <div className="bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 p-1 sm:p-1.5 rounded-full">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="font-bold text-[var(--text-main)] text-xs sm:text-base">
            Added to cart!
          </span>
        </div>
      </div>

      <button onClick={() => safeNavigate('home')} className="flex items-center gap-1 sm:gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-4 sm:mb-8 text-sm sm:text-base font-medium">
        <ChevronLeft size={18} /> Back to Products
      </button>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-16">
        
        {/* Left Side: Product Image */}
        <div className="w-full lg:w-1/2">
          <FadeIn>
            <div className="relative w-full aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-4 glass-panel border border-[var(--glass-border)] shadow-2xl overflow-hidden group">
              <img 
                src={product.image} 
                alt={product.name} 
                className={`w-full h-full object-cover rounded-[1.5rem] sm:rounded-[2rem] transition-transform duration-700 group-hover:scale-105 ${product.quantity === 0 ? 'grayscale opacity-60' : ''}`}
              />
              
              {/* Sold Out Stamp */}
              {product.quantity === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-red-500/90 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl border-2 border-red-200/50 transform -rotate-12 font-black text-2xl sm:text-5xl tracking-widest shadow-2xl backdrop-blur-md">
                    SOLD OUT
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <FadeIn delay={200}>
            
            {/* Reviews & Badges */}
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

            <h1 className="text-xl sm:text-5xl font-bold sm:font-extrabold text-[var(--text-main)] mb-1 sm:mb-2 leading-tight">{product.name}</h1>
            <p className="text-lg sm:text-3xl font-bold sm:font-black text-teal-400 mb-3 sm:mb-6">${product.price}</p>
            <p className="text-xs sm:text-lg font-light leading-relaxed mb-4 sm:mb-8 text-[var(--text-muted)]">
              {product.description}
            </p>

            {/* Color Selection - Single row on mobile */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-bold text-xs sm:text-base text-[var(--text-main)] mb-2 sm:mb-3 flex items-center justify-between">
                Color: <span className="text-teal-400 font-medium">{selectedColor}</span>
              </h3>
              <div className="flex gap-1.5 sm:gap-3 flex-nowrap overflow-x-auto pb-2">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => product.quantity > 0 && setSelectedColor(color)}
                    disabled={product.quantity === 0}
                    className={`px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl border-2 font-bold text-xs sm:text-base transition-all whitespace-nowrap ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${selectedColor === color ? 'border-teal-400 bg-teal-400/10 text-teal-400' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:border-teal-400/50'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4 sm:mb-8">
              <h3 className="font-bold text-xs sm:text-base text-[var(--text-main)] mb-2 sm:mb-3 flex items-center justify-between">
                Size: <span className="text-teal-400 font-medium">{selectedSize}</span>
              </h3>
              <div className="flex gap-1.5 sm:gap-3 flex-wrap">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => product.quantity > 0 && setSelectedSize(size)}
                    disabled={product.quantity === 0}
                    className={`w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl border-2 font-bold text-xs sm:text-base transition-all flex items-center justify-center ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${selectedSize === size ? 'border-teal-400 bg-teal-400/10 text-teal-400' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:border-teal-400/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons - Perfect row layout */}
            <div className="flex gap-2 sm:gap-4 w-full">
              <button 
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className={`flex-1 py-2 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-2xl font-bold text-xs sm:text-lg flex items-center justify-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${product.quantity === 0 ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'glass-button text-[var(--text-main)] hover:bg-teal-500/10 hover:border-teal-400/50'}`}
              >
                <ShoppingCart size={14} className="sm:w-5 sm:h-5 shrink-0" /> Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className={`flex-1 py-2 sm:py-4 px-2 sm:px-4 rounded-lg sm:rounded-2xl font-extrabold text-xs sm:text-lg flex items-center justify-center transition-all whitespace-nowrap ${product.quantity === 0 ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]'}`}
              >
                Buy Now
              </button>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row gap-2 sm:gap-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs sm:text-sm font-medium">
                <ShieldCheck size={16} className="text-teal-400 sm:w-5 sm:h-5" /> 100% Original Products
              </div>
            </div>

          </FadeIn>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-8 mt-8 sm:mt-16">
        <h2 className="text-xl sm:text-3xl font-bold border-b border-[var(--glass-border)] pb-3 sm:pb-4">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {similarProducts.map(item => (
            <div key={item.id} className="glass-panel rounded-xl sm:rounded-2xl p-2 sm:p-3 hover:border-teal-500/50 transition cursor-pointer">
              <img src={item.image} alt={item.name} className="w-full h-24 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-2 sm:mb-3" />
              <h4 className="font-bold text-xs sm:text-sm line-clamp-2">{item.name}</h4>
              <p className="text-teal-400 text-xs sm:text-base font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4 sm:space-y-8 mt-8 sm:mt-16">
        <h2 className="text-xl sm:text-3xl font-bold border-b border-[var(--glass-border)] pb-3 sm:pb-4">Customer Reviews</h2>
        
        {/* Existing Reviews */}
        <div className="space-y-3 sm:space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="glass-panel p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <div className="flex justify-between font-bold text-xs sm:text-base text-teal-400"><span>{r.user}</span> <span className="text-yellow-500">{'★'.repeat(r.rating)}</span></div>
              <p className="text-xs sm:text-sm mt-1">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Submit Review - Only for logged-in users */}
        {isLoggedIn ? (
          <form onSubmit={handleAddReview} className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4">
            <h3 className="font-bold text-sm sm:text-lg">Submit a Review</h3>
            
            {/* Display user nickname as read-only */}
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">Submitting as:</p>
              <p className="font-bold text-sm sm:text-base text-teal-400">{userNickname}</p>
            </div>
            
            <textarea placeholder="Write a review..." value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 h-20 sm:h-24 text-xs sm:text-base" />
            <button type="submit" className="glass-button px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-base flex items-center gap-2">
              <Send size={16} /> Submit
            </button>
          </form>
        ) : (
          <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center">
            <p className="text-xs sm:text-base text-[var(--text-muted)]">Please <button onClick={() => safeNavigate('signin')} className="text-teal-400 hover:text-teal-300 font-bold">sign in</button> to submit a review</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsView;