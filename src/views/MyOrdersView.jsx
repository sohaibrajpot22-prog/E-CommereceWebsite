import React, { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle2, ChevronLeft, Loader2, Search } from 'lucide-react';
import { dbFirestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

const MyOrdersView = ({ user, navigate }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      try {
        // Firebase se sirf is user ke orders mangwao
        const q = query(collection(dbFirestore, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Naye orders upar dikhane ke liye sort karein
        ordersData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching my orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    if (status === 'Pending') return <Clock size={16} className="text-yellow-400" />;
    if (status === 'Shipped') return <Truck size={16} className="text-blue-400" />;
    if (status === 'Delivered') return <CheckCircle2 size={16} className="text-teal-400" />;
    return <Package size={16} className="text-[var(--text-muted)]" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400';
    if (status === 'Shipped') return 'bg-blue-400/10 border-blue-400/30 text-blue-400';
    if (status === 'Delivered') return 'bg-teal-400/10 border-teal-400/30 text-teal-400';
    return 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-muted)]';
  };

  return (
    <div className="w-full min-h-[80vh] pb-20 pt-8 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-8 font-medium">
        <ChevronLeft size={20} /> Back to Home
      </button>

      <FadeIn>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--text-main)]">My Orders</h1>
            <p className="text-[var(--text-muted)] text-sm">Track and view your order history.</p>
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="animate-spin text-teal-400" />
        </div>
      ) : orders.length === 0 ? (
        <FadeIn delay={100}>
          <div className="glass-panel rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center border border-[var(--glass-border)] shadow-xl">
            <Search size={64} className="text-[var(--text-muted)] mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">No orders yet</h3>
            <p className="text-[var(--text-muted)] mb-6">Looks like you haven't made your first purchase.</p>
            <button onClick={() => navigate('shirts')} className="bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              Start Shopping
            </button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <FadeIn key={order.id} delay={idx * 100}>
              <div className="glass-panel p-6 rounded-3xl border border-[var(--glass-border)] hover:border-teal-400/30 transition-colors">
                
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-4 mb-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1">Order ID</p>
                    <p className="font-mono text-teal-400 font-bold">{order.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold w-fit ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-[var(--bg-1)]/50 p-3 rounded-2xl border border-[var(--glass-border)]">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--text-main)] text-sm truncate">{item.name}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Size: {item.selectedSize} | Color: {item.selectedColor?.name || item.selectedColor}</p>
                      </div>
                      <p className="text-teal-400 font-bold text-sm shrink-0">RS {item.price} <span className="text-[var(--text-muted)] text-xs">x{item.cartQuantity || 1}</span></p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--glass-bg)] p-4 rounded-2xl">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Payment Method</p>
                    <p className="text-sm font-bold text-[var(--text-main)] uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Total Amount</p>
                    <p className="text-xl font-black text-teal-400">RS {order.totalAmount}</p>
                  </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersView;