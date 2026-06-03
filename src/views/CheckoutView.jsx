import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Wallet, ShieldCheck, MapPin, Plus, Trash2, Edit2 } from "lucide-react";
import { FadeIn } from '../components/FadeIn';

const CheckoutView = ({ cart, setCart, navigate, user, setDb }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // ADDRESS CRUD STATE
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ id: null, label: 'Home', fullName: '', phone: '', city: '', detail: '' });

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (addressForm.id) {
      setSavedAddresses(prev => prev.map(a => a.id === addressForm.id ? addressForm : a));
    } else {
      const newAddress = { ...addressForm, id: Date.now() };
      setSavedAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
    }
    setIsEditingAddress(false);
    setAddressForm({ id: null, label: 'Home', fullName: '', phone: '', city: '', detail: '' });
  };

  const deleteAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) setSelectedAddressId(null);
  };

  const editAddress = (address) => {
    setAddressForm(address);
    setIsEditingAddress(true);
  };

  const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if(cart.length === 0 || !selectedAddressId) {
        alert("Please select an address and ensure cart is not empty.");
        return;
    }

    const shippingAddress = savedAddresses.find(a => a.id === selectedAddressId);

    const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        customer: shippingAddress.fullName,
        email: user?.email || 'Guest',
        date: new Date().toISOString().split('T')[0],
        total: total,
        status: 'Pending',
        items: cart,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod
    };

    setDb(prev => ({
        ...prev,
        orders: [newOrder, ...(prev.orders || [])]
    }));

    alert("Order Placed Successfully!");
    setCart([]); 
    navigate('home');
  };

  return (
    <div className="w-full min-h-screen pb-20 pt-4 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      <button onClick={() => navigate('cart')} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-teal-400 transition-colors w-fit mb-8 font-medium">
        <ChevronLeft size={20} /> Back to Cart
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-3/5 space-y-8">
          <FadeIn>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)] mb-6">Checkout</h1>
            
            <div className="space-y-8">
              
              {/* ADDRESS BOOK SECTION */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--text-main)]">Shipping Address</h2>
                  {!isEditingAddress && (
                    <button onClick={() => { setAddressForm({ id: null, label: 'Home', fullName: user?.nickname || '', phone: '', city: '', detail: '' }); setIsEditingAddress(true); }} className="text-sm font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
                      <Plus size={16}/> Add New
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4 bg-[var(--bg-2)]/50 p-4 rounded-2xl border border-[var(--glass-border)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[var(--text-muted)]">Address Label</label>
                        <select value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="w-full p-2 rounded-lg bg-[var(--glass-bg)] text-[var(--text-main)] border border-[var(--glass-border)]">
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)]">Full Name</label>
                        <input required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} type="text" className="w-full p-2 rounded-lg bg-[var(--glass-bg)] text-[var(--text-main)] border border-[var(--glass-border)]"/>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)]">Phone</label>
                        <input required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} type="text" className="w-full p-2 rounded-lg bg-[var(--glass-bg)] text-[var(--text-main)] border border-[var(--glass-border)]"/>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-muted)]">City</label>
                        <input required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} type="text" className="w-full p-2 rounded-lg bg-[var(--glass-bg)] text-[var(--text-main)] border border-[var(--glass-border)]"/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-[var(--text-muted)]">Complete Address</label>
                        <textarea required value={addressForm.detail} onChange={e => setAddressForm({...addressForm, detail: e.target.value})} className="w-full p-2 rounded-lg bg-[var(--glass-bg)] text-[var(--text-main)] border border-[var(--glass-border)] resize-none" rows="2"></textarea>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-900 rounded-lg text-sm font-bold">Save</button>
                      <button type="button" onClick={() => setIsEditingAddress(false)} className="px-4 py-2 border border-[var(--glass-border)] text-[var(--text-main)] rounded-lg text-sm font-bold">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map(address => (
                      <div key={address.id} onClick={() => setSelectedAddressId(address.id)} className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-teal-500 bg-teal-500/10' : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-teal-500/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold bg-[var(--bg-2)] px-2 py-1 rounded-md text-[var(--text-main)] flex items-center gap-1"><MapPin size={12}/> {address.label}</span>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); editAddress(address); }} className="text-[var(--text-muted)] hover:text-blue-400"><Edit2 size={14}/></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteAddress(address.id); }} className="text-[var(--text-muted)] hover:text-red-400"><Trash2 size={14}/></button>
                          </div>
                        </div>
                        <p className="font-bold text-[var(--text-main)] text-sm">{address.fullName}</p>
                        <p className="text-[var(--text-muted)] text-xs mt-1 line-clamp-2">{address.detail}, {address.city}</p>
                        <p className="text-teal-400 text-xs font-bold mt-1">{address.phone}</p>
                      </div>
                    ))}
                    {savedAddresses.length === 0 && <p className="text-[var(--text-muted)] text-sm">No saved addresses. Please add one.</p>}
                  </div>
                )}
              </div>

              {/* PAYMENT METHOD */}
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
              </div>
              
            </div>
          </FadeIn>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full lg:w-2/5 space-y-6">
          <FadeIn delay={200}>
            <div className="glass-panel p-6 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[var(--glass-bg)] p-3 rounded-2xl border border-[var(--glass-border)]">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--text-main)] text-sm">{item.name}</h4>
                        <p className="text-xs text-[var(--text-muted)]">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <p className="text-teal-400 font-bold text-sm">${item.price}</p>
                      </div>
                    </div>
                ))}
              </div>

              <div className="border-t border-[var(--glass-border)] pt-4 space-y-3">
                <div className="flex justify-between text-xl font-extrabold text-[var(--text-main)]">
                  <span>Total</span>
                  <span className="text-teal-400">${total}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || !selectedAddressId}
                className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all flex justify-center items-center gap-2 ${
                  (cart.length === 0 || !selectedAddressId) 
                  ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-400 to-teal-300 text-slate-900 shadow-lg'
                }`}
              >
                Place Order <ShieldCheck size={20} />
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;