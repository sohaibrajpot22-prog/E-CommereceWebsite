import { ChevronRight, ArrowRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export const HomeView = ({ navigate, db }) => (
  <div className="flex flex-col w-full min-h-[80vh] justify-between">
    
    {/* --- Hero Section --- */}
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full mb-12 lg:mb-20">
      <div className="flex-1 space-y-6 sm:space-y-8 z-10 w-full text-center lg:text-left">
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Reflect Your <br className="hidden sm:block lg:hidden"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200">True Style</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-lg mx-auto lg:mx-0 font-light">
            Discover our exclusive collection of premium shirts and pants, designed with fluidity and modern aesthetics.
          </p>
        </FadeIn>
        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <button onClick={() => navigate('shirts')} className="w-full sm:w-auto justify-center glass-button px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg flex items-center gap-2">
              Shop Shirts <ChevronRight size={20} />
            </button>
            <button onClick={() => navigate('combinations')} className="w-full sm:w-auto justify-center glass-panel px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition">
              View Pairs
            </button>
          </div>
        </FadeIn>
      </div>
      
      <div className="flex-1 w-full relative hidden lg:flex justify-center items-center h-[500px]">
        <FadeIn delay={600}>
          <div className="relative w-80 h-[450px] glass-panel rounded-[3rem] p-4 hero-product border border-white/20 shadow-2xl">
            <img 
              src={db.combinations[0]?.image || 'https://placehold.co/400x500/083344/ffffff'} 
              alt="Featured" 
              className="w-full h-full object-cover rounded-[2.5rem]"
            />
            <div className="absolute bottom-8 left-8 right-8 glass-panel rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{db.combinations[0]?.name || 'Featured Look'}</p>
                <p className="text-teal-200">${db.combinations[0]?.price || '120'}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>

    {/* --- Featured Products Section --- */}
    <div className="w-full mb-12 lg:mb-20">
      <FadeIn>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-wide border-b border-white/20 pb-2 sm:pb-4 inline-block mb-8">Trending Now</h2>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {db.shirts.slice(0, 4).map((product, idx) => (
          <FadeIn key={product.id} delay={idx * 100}>
            <div 
              className="glass-panel rounded-3xl overflow-hidden group hover:border-white/40 transition-colors duration-300 flex flex-col h-full cursor-pointer" 
              onClick={() => navigate('shirts')}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                <p className="text-teal-300 font-semibold">${product.price}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>

    {/* --- Sign In / Join Section --- */}
    <FadeIn delay={200}>
      <div className="w-full glass-panel rounded-[3rem] p-8 sm:p-12 mb-12 lg:mb-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="z-10 md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the Glass Club</h2>
          <p className="text-white/70 text-lg">Sign in or create an account to unlock exclusive drops, early access, and personalized style recommendations.</p>
        </div>
        <div className="z-10 md:w-1/2 w-full flex flex-col sm:flex-row gap-4 justify-end">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="glass-panel bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white focus:outline-none focus:border-teal-400 transition flex-1 max-w-sm"
          />
          <button className="glass-button bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-transform">
            Sign In <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </FadeIn>

    {/* --- Newly Added Footer --- */}
    <FadeIn delay={400}>
      <footer className="w-full glass-panel rounded-3xl p-6 sm:p-8 mt-auto flex flex-col md:flex-row justify-between items-center text-white/70 gap-6 border-t border-white/10">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white tracking-widest">GLASS</h3>
          <p className="text-sm mt-1">Fluidity in fashion.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-semibold">
          <button onClick={() => navigate('shirts')} className="hover:text-teal-300 transition">Shirts</button>
          <button onClick={() => navigate('pants')} className="hover:text-teal-300 transition">Pants</button>
          <button onClick={() => navigate('combinations')} className="hover:text-teal-300 transition">Pairs</button>
          <a href="#" className="hover:text-teal-300 transition">Contact</a>
        </div>
        
        <div className="text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} Glass Apparel.<br className="hidden md:block" /> All rights reserved.
        </div>
      </footer>
    </FadeIn>

  </div>
);

export default HomeView;