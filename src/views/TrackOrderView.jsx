import React, { useState } from 'react';
import { PackageSearch, Package, Truck, CheckCircle2, Clock, ChevronLeft, Loader2 } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { dbFirestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TrackOrderView = ({ navigate }) => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setOrderData(null);

    try {
      // Firebase se Order ID ke zariye data mangwana
      const docRef = doc(dbFirestore, "orders", orderId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrderData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setErrorMsg("Order not found! Please check your Tracking ID.");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Status ke hisaab se progress bar ki width set karna
  const getProgressWidth = (status) => {
    if (status === 'Pending') return 'w-1/3';
    if (status === 'Shipped') return 'w-2/3';
    if (status === 'Delivered') return 'w-full';
    return 'w-0';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 min-h-[70vh]">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-8 font-medium">
        <ChevronLeft size={20} /> Back to Home
      </button>

      <FadeIn>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
            <PackageSearch size={40} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] mb-4">Track Your Order</h1>
          <p className="text-[var(--text-muted)] text-lg">Enter your tracking ID to see your order's current status.</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrackOrder} className="max-w-xl mx-auto relative mb-12">
          <input 
            type="text" 
            placeholder="e.g., ord_abc123xyz" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-6 pr-32 py-5 rounded-2xl bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] focus:border-teal-400 text-[var(--text-main)] text-lg focus:outline-none shadow-xl transition-all"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-teal-500 to-teal-400 text-slate-900 font-bold px-6 rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Track'}
          </button>
        </form>

        {/* Error Message */}
        {errorMsg && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl text-center font-medium animate-in zoom-in duration-300">
            {errorMsg}
          </div>
        )}

        {/* Order Details & Timeline */}
        {orderData && (
          <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-[var(--glass-border)] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-[var(--glass-border)] pb-6">
              <div>
                <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">Order ID</p>
                <p className="text-xl font-mono text-[var(--text-main)] font-bold">{orderData.id}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-2xl text-teal-400 font-black">RS {orderData.totalAmount}</p>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="relative mb-12 mt-8">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 w-full h-2 bg-[var(--glass-bg)] -translate-y-1/2 rounded-full overflow-hidden">
                {/* Active Progress Line */}
                <div className={`h-full bg-teal-400 transition-all duration-1000 ease-out ${getProgressWidth(orderData.status || 'Pending')}`}></div>
              </div>

              {/* Status Points */}
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${['Pending', 'Shipped', 'Delivered'].includes(orderData.status || 'Pending') ? 'bg-teal-500 border-teal-200 text-slate-900' : 'bg-[var(--bg-1)] border-[var(--glass-border)] text-[var(--text-muted)]'}`}>
                    <Clock size={20} />
                  </div>
                  <p className="mt-3 font-bold text-sm sm:text-base text-[var(--text-main)]">Pending</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${['Shipped', 'Delivered'].includes(orderData.status) ? 'bg-teal-500 border-teal-200 text-slate-900' : 'bg-[var(--bg-1)] border-[var(--glass-border)] text-[var(--text-muted)]'}`}>
                    <Truck size={20} />
                  </div>
                  <p className="mt-3 font-bold text-sm sm:text-base text-[var(--text-main)]">Shipped</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${orderData.status === 'Delivered' ? 'bg-teal-500 border-teal-200 text-slate-900' : 'bg-[var(--bg-1)] border-[var(--glass-border)] text-[var(--text-muted)]'}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="mt-3 font-bold text-sm sm:text-base text-[var(--text-main)]">Delivered</p>
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6">
              <h3 className="font-bold text-lg text-[var(--text-main)] mb-4 flex items-center gap-2">
                <Package size={20} className="text-teal-400" /> Items in this Order
              </h3>
              <div className="space-y-4">
                {orderData.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-[var(--text-main)] font-semibold">{item.name}</p>
                      <p className="text-[var(--text-muted)] text-sm">Size: {item.selectedSize} | Qty: {item.cartQuantity || 1}</p>
                    </div>
                    <p className="text-teal-400 font-bold">RS {item.price}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default TrackOrderView;