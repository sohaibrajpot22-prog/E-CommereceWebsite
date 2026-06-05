import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Wallet, Info, CheckCircle2, ShieldCheck, Trash2, Loader2, Copy, Check } from "lucide-react";
import { dbFirestore } from '../firebase'; 
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser'; // NAYA IMPORT

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

const CheckoutView = ({ cartItems, setCartItems, navigate, user }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [storeDetails, setStoreDetails] = useState({
    bankName: "Loading...", accountTitle: "Loading...", accountNumber: "Loading...",
    easyPaisa: "Loading...", jazzCash: "Loading...", advanceAmount: 250, 
    disclaimer: "Loading..."
  });

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const docRef = doc(dbFirestore, "settings", "storeDetails");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStoreDetails(docSnap.data());
        } else {
            setStoreDetails({
                bankName: "Meezan Bank", accountTitle: "Vintage Clothing", accountNumber: "0000 0000 0000 0000",
                easyPaisa: "0300 0000000", jazzCash: "0300 0000000", advanceAmount: 250,
                disclaimer: "Your order will be processed after payment verification. Please share the payment screenshot on our WhatsApp."
            });
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };
    fetchStoreDetails();
  }, []);

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '', 
    email: user ? user.email : '',
    phone: '', city: '', address: ''
  });

  const removeItem = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const subtotal = cartItems.reduce((total, item) => total + (parseInt(item.price || 0) * (item.cartQuantity || 1)), 0);
  const shipping = 0; 
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if(cartItems.length === 0) return;
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const orderData = {
        customerInfo: formData, 
        items: cartItems,
        totalAmount: total,
        paymentMethod: paymentMethod,
        status: 'Pending', 
        userId: user ? user.uid : 'Guest', 
        createdAt: serverTimestamp()
      };

      // 1. Save to Firebase
      const docRef = await addDoc(collection(dbFirestore, "orders"), orderData);
      const newOrderId = docRef.id;
      
      setPlacedOrderId(newOrderId);

      // 2. SEND EMAIL VIA EMAILJS
      try {
        const templateParams = {
    customer_name: formData.fullName,
    email: formData.email, // EmailJS template mein {{email}} use karna
    order_id: newOrderId,
    
    // Yahan Loop ka data hai
    orders: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        units: item.cartQuantity || 1,
        image_url: item.image
    })),
    
    // Billing
    subtotal: subtotal,
    total: total
};

        // YAHAN APNI KEYS DAALEIN (Service ID, Template ID, Public Key)
        await emailjs.send(
          'service_jqu8l2u', 
          'template_7799zze', 
          templateParams, 
          'Motgi5gtfguF3zA3q'
        );
        
        console.log("Email sent successfully!");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Hum order rokna nahi chahte agar email fail ho jaye, isliye isko alag try-catch mein rakha hai.
      }

      setOrderPlaced(true);
      setCartItems([]); 
    } catch (error) {
      console.error("Order placing error:", error);
      setErrorMsg("Failed to place order. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(placedOrderId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (orderPlaced) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <FadeIn>
          <div className="glass-panel max-w-lg w-full p-8 md:p-12 rounded-[2.5rem] text-center space-y-6 border border-teal-500/30 shadow-[0_0_50px_rgba(45,212,191,0.1)]">
            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-400">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-main)]">Order Confirmed!</h1>
            
            <div className="bg-black/20 border border-white/10 rounded-2xl p-5 flex items-center justify-between my-6">
                <div className="text-left overflow-hidden">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Your Tracking ID</p>
                    <p className="text-lg sm:text-xl font-mono text-teal-400 font-bold truncate">{placedOrderId}</p>
                </div>
                <button 
                    onClick={handleCopyOrderId} 
                    className="p-3 bg-white/5 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-colors shrink-0 ml-4 flex items-center gap-2"
                    title="Copy Tracking ID"
                >
                    {isCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>

            <p className="text-[var(--text-muted)] leading-relaxed text-sm sm:text-base">
              Thank you for shopping with Vintage Clothing. A confirmation email has been sent to {formData.email}. 
              {paymentMethod === 'cod' 
                ? ` Please transfer RS ${storeDetails.advanceAmount} advance to confirm your order.` 
                : " Please send the payment screenshot to our WhatsApp."}
            </p>
            <button onClick={() => navigate('home')} className="mt-4 px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 rounded-2xl font-extrabold transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] w-full">
              Continue Shopping
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20 pt-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      <button onClick={() => navigate('cart')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-8 font-medium">
        <ChevronLeft size={20} /> Back to Cart
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-3/5 space-y-8">
          <FadeIn>
            <h1 className="text-2xl sm:text-4xl font-bold sm:font-extrabold text-[var(--text-main)] mb-6">Checkout</h1>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
                  {errorMsg}
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-[var(--text-muted)] pl-1">Full Name</label>
                    <input required type="text" value={formData.fullName} onChange={(e)=> setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-400 transition-all" />
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-[var(--text-muted)] pl-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e)=> setFormData({...formData, email: e.target.value})} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-400 transition-all" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--text-muted)] pl-1">Phone Number</label>
                    <input required type="tel" value={formData.phone} onChange={(e)=> setFormData({...formData, phone: e.target.value})} placeholder="03XX XXXXXXX" className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-400 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--text-muted)] pl-1">City</label>
                    <input required type="text" value={formData.city} onChange={(e)=> setFormData({...formData, city: e.target.value})} placeholder="Lahore" className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-400 transition-all" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-[var(--text-muted)] pl-1">Complete Address</label>
                    <textarea required rows="2" value={formData.address} onChange={(e)=> setFormData({...formData, address: e.target.value})} placeholder="House #, Street, Area..." className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-400 transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-4">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${paymentMethod === 'cod' ? 'border-teal-500 bg-teal-500/10' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-btn-hover)]'}`}>
                    <Wallet size={28} className={paymentMethod === 'cod' ? 'text-teal-400' : 'text-[var(--text-muted)]'} />
                    <span className="font-bold text-[var(--text-main)]">Cash on Delivery</span>
                  </div>
                  <div onClick={() => setPaymentMethod('online')} className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${paymentMethod === 'online' ? 'border-teal-500 bg-teal-500/10' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-btn-hover)]'}`}>
                    <CreditCard size={28} className={paymentMethod === 'online' ? 'text-teal-400' : 'text-[var(--text-muted)]'} />
                    <span className="font-bold text-[var(--text-main)]">Online Payment</span>
                  </div>
                </div>
                
                <div className="bg-[var(--bg-2)]/50 border border-[var(--glass-border)] p-4 rounded-xl flex items-start gap-3 mt-4">
                  <Info size={20} className="text-teal-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {paymentMethod === 'cod' 
                      ? <span><strong>Note:</strong> Advance payment of <strong>RS {storeDetails.advanceAmount}</strong> is required to confirm your COD order. The rest will be collected at delivery.</span>
                      : <span><strong>Note:</strong> Please transfer the total amount of <strong>RS {total}</strong> to the account provided below.</span>
                    }
                  </p>
                </div>
              </div>
            </form>
          </FadeIn>
        </div>

        <div className="w-full lg:w-2/5 space-y-6">
          <FadeIn delay={200}>
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-4">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-center text-[var(--text-muted)] py-4">Your cart is empty.</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[var(--glass-bg)] p-3 rounded-2xl border border-[var(--glass-border)] group">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--text-main)] text-sm">{item.name}</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Size: {item.selectedSize} | Color: {item.selectedColor?.name || item.selectedColor}</p>
                        <p className="text-teal-400 font-bold text-sm mt-1">RS {item.price} <span className="text-[var(--text-muted)] text-xs ml-1">x{item.cartQuantity || 1}</span></p>
                      </div>
                      <button type="button" onClick={() => removeItem(idx)} className="p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Remove Item">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[var(--glass-border)] pt-4 space-y-3">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span>RS {subtotal}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Shipping</span>
                  <span className="text-teal-400">Free</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold sm:font-extrabold text-[var(--text-main)] pt-2 border-t border-[var(--glass-border)]">
                  <span>Total</span>
                  <span className="text-teal-400">RS {total}</span>
                </div>
              </div>

              <button form="checkout-form" type="submit" disabled={cartItems.length === 0 || isLoading} className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all flex justify-center items-center gap-2 ${cartItems.length === 0 || isLoading ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]'}`}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Place Order <ShieldCheck size={20} /></>}
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="glass-panel p-6 rounded-3xl space-y-4 border-teal-500/20 bg-teal-500/5">
              <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">Bank & Payment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                  <span className="text-[var(--text-muted)]">Bank</span>
                  <span className="font-semibold text-[var(--text-main)]">{storeDetails.bankName}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                  <span className="text-[var(--text-muted)]">Title</span>
                  <span className="font-semibold text-[var(--text-main)]">{storeDetails.accountTitle}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                  <span className="text-[var(--text-muted)]">Account #</span>
                  <span className="font-semibold text-teal-400">{storeDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--glass-border)] pb-2">
                  <span className="text-[var(--text-muted)]">EasyPaisa</span>
                  <span className="font-semibold text-teal-400">{storeDetails.easyPaisa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">JazzCash</span>
                  <span className="font-semibold text-teal-400">{storeDetails.jazzCash}</span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--bg-1)] p-3 rounded-xl border border-[var(--glass-border)] text-center">
                {storeDetails.disclaimer}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;