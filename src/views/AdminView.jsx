import React, { useState, useEffect } from 'react';
import { Package, Users, Settings, Clock, Truck, CheckCircle, Shield, User, Save, Loader2, Landmark } from 'lucide-react';
import { dbFirestore, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const AdminView = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState('orders');
    
    // States for Data
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    
    // States for UI
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingStore, setIsSavingStore] = useState(false);
    
    // Profile Settings State
    const [profileName, setProfileName] = useState(user?.name || '');
    const [updateMsg, setUpdateMsg] = useState('');

    // Store Payment Settings State
    const [storeSettings, setStoreSettings] = useState({
        bankName: "", accountTitle: "", accountNumber: "",
        easyPaisa: "", jazzCash: "", advanceAmount: 250, disclaimer: ""
    });
    const [storeUpdateMsg, setStoreUpdateMsg] = useState('');

    // Fetch All Data (Orders, Users, Settings)
    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Orders
            if (activeTab === 'orders') {
                const querySnapshot = await getDocs(collection(dbFirestore, "orders"));
                const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(ordersData);
            }
            
            // 2. Fetch Users
            if (activeTab === 'users') {
                const querySnapshot = await getDocs(collection(dbFirestore, "users"));
                const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsersList(usersData);
            }

            // 3. Fetch Store Settings
            if (activeTab === 'settings') {
                const docRef = doc(dbFirestore, "settings", "storeDetails");
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    setStoreSettings(docSnap.data());
                }
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    // Update Order Status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(dbFirestore, "orders", orderId), { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Status update failed!");
        }
    };

    // Update User Role (Make Admin/Customer)
    const updateUserRole = async (userId, newRole) => {
        try {
            await updateDoc(doc(dbFirestore, "users", userId), { role: newRole });
            setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Role update failed!");
        }
    };

    // Update Profile Settings
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setUpdateMsg('');
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: profileName });
                await updateDoc(doc(dbFirestore, "users", auth.currentUser.uid), { name: profileName });
                if (setUser) {
                    setUser({ ...user, name: profileName });
                }
                setUpdateMsg('Profile updated successfully!');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setUpdateMsg('Error updating profile.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setUpdateMsg(''), 3000);
        }
    };

    // NAYA: Save Store Payment Details
    const handleSaveStoreDetails = async (e) => {
        e.preventDefault();
        setIsSavingStore(true);
        setStoreUpdateMsg('');
        try {
            await setDoc(doc(dbFirestore, "settings", "storeDetails"), storeSettings);
            setStoreUpdateMsg('Store details updated successfully!');
        } catch (error) {
            console.error("Error saving store details:", error);
            setStoreUpdateMsg('Error saving store details.');
        } finally {
            setIsSavingStore(false);
            setTimeout(() => setStoreUpdateMsg(''), 3000);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Delivered': return 'text-teal-400 bg-teal-400/10 border-teal-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Menu */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <div className="glass-panel p-6 rounded-3xl mb-4 text-center border border-teal-500/30">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-teal-400 to-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Shield size={30} className="text-white" />
                    </div>
                    <h2 className="font-bold text-xl text-[var(--text-main)]">{user?.name || 'Admin'}</h2>
                    <p className="text-teal-400 text-sm font-medium">Administrator</p>
                </div>

                <button 
                    onClick={() => setActiveTab('orders')} 
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === 'orders' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'glass-panel text-[var(--text-muted)] hover:text-teal-400'}`}
                >
                    <Package size={20} /> Order Management
                </button>
                <button 
                    onClick={() => setActiveTab('users')} 
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === 'users' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'glass-panel text-[var(--text-muted)] hover:text-teal-400'}`}
                >
                    <Users size={20} /> User Accounts
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold ${activeTab === 'settings' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'glass-panel text-[var(--text-muted)] hover:text-teal-400'}`}
                >
                    <Settings size={20} /> General Settings
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 glass-panel p-6 sm:p-8 rounded-[2.5rem] border border-[var(--glass-border)] min-h-[60vh]">
                
                {isLoading ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-teal-400 gap-4 mt-20">
                        <Loader2 size={40} className="animate-spin" />
                        <p className="font-bold">Loading data...</p>
                    </div>
                ) : (
                    <>
                        {/* --- ORDERS TAB --- */}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-6">Recent Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="text-center text-[var(--text-muted)] py-10">No orders found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-black/20 border border-white/10 p-5 rounded-2xl flex flex-col lg:flex-row gap-6 justify-between lg:items-center hover:border-teal-400/30 transition-colors">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-lg text-[var(--text-main)]">{order.customerInfo?.fullName}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                            {order.status === 'Pending' && <Clock size={12} />}
                                                            {order.status === 'Shipped' && <Truck size={12} />}
                                                            {order.status === 'Delivered' && <CheckCircle size={12} />}
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[var(--text-muted)] text-sm">{order.customerInfo?.phone} • {order.customerInfo?.city}</p>
                                                    
                                                    {/* Ordered Items Summary */}
                                                    <div className="mt-3 bg-black/40 rounded-xl p-3 border border-white/5 text-sm">
                                                        <p className="font-bold text-teal-400 mb-2 border-b border-white/10 pb-1">Ordered Items ({order.items?.length}):</p>
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center py-1">
                                                                <span className="text-[var(--text-main)] truncate max-w-[200px]">{item.name}</span>
                                                                <span className="text-[var(--text-muted)] ml-2 text-xs">Size: {item.selectedSize} | Color: {item.selectedColor?.name || item.selectedColor} | Qty: {item.cartQuantity || 1}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="text-teal-400 font-bold mt-2">Total: RS {order.totalAmount} • {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 shrink-0">
                                                    <button onClick={() => updateOrderStatus(order.id, 'Pending')} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${order.status === 'Pending' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50' : 'border-white/10 text-[var(--text-muted)] hover:border-yellow-400/50'}`}>Pending</button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'Shipped')} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${order.status === 'Shipped' ? 'bg-blue-400/20 text-blue-400 border-blue-400/50' : 'border-white/10 text-[var(--text-muted)] hover:border-blue-400/50'}`}>Shipped</button>
                                                    <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${order.status === 'Delivered' ? 'bg-teal-400/20 text-teal-400 border-teal-400/50' : 'border-white/10 text-[var(--text-muted)] hover:border-teal-400/50'}`}>Delivered</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- USERS TAB --- */}
                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-6">User Accounts</h2>
                                {usersList.length === 0 ? (
                                    <div className="text-center text-[var(--text-muted)] py-10">No users found.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {usersList.map(u => (
                                            <div key={u.id} className="bg-black/20 border border-white/10 p-5 rounded-2xl flex flex-col gap-4 hover:border-teal-400/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-teal-400 border border-white/10">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[var(--text-main)]">{u.name || 'Unknown User'}</h3>
                                                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                                                    <span className="text-sm text-[var(--text-muted)]">Account Role:</span>
                                                    <select 
                                                        value={u.role || 'customer'} 
                                                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                                                        className={`bg-black/40 border outline-none text-sm font-bold px-3 py-1.5 rounded-lg cursor-pointer ${u.role === 'admin' ? 'text-teal-400 border-teal-400/50' : 'text-white border-white/20'}`}
                                                    >
                                                        <option value="customer" className="text-black">Customer</option>
                                                        <option value="admin" className="text-black">Admin</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- SETTINGS TAB --- */}
                        {activeTab === 'settings' && (
                            <div className="space-y-10 max-w-2xl">
                                
                                {/* 1. Personal Profile Settings */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">Profile Settings</h2>
                                    <form onSubmit={handleUpdateProfile} className="space-y-5 bg-black/20 p-6 rounded-3xl border border-white/10">
                                        {updateMsg && (
                                            <div className="bg-teal-500/10 border border-teal-500/50 text-teal-400 px-4 py-3 rounded-xl text-sm font-medium">
                                                {updateMsg}
                                            </div>
                                        )}
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Display Name</label>
                                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-teal-400 transition-colors">
                                                <User size={20} className="text-teal-400" />
                                                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full" required />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Email Address (Read Only)</label>
                                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3 opacity-70 cursor-not-allowed">
                                                <input type="email" value={user?.email || ''} disabled className="bg-transparent border-none outline-none text-[var(--text-muted)] w-full cursor-not-allowed" />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={isSaving} className="w-full sm:w-auto mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-slate-900 font-extrabold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all disabled:opacity-50">
                                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                            {isSaving ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </form>
                                </div>

                                {/* 2. Store Payment Settings (NAYA) */}
                                <div className="space-y-6 pt-6 border-t border-[var(--glass-border)]">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] flex items-center gap-3">
                                        <Landmark size={28} className="text-teal-400" /> Payment & Store Details
                                    </h2>
                                    <p className="text-[var(--text-muted)] text-sm mb-4">These details will be displayed to customers on the Checkout page.</p>

                                    <form onSubmit={handleSaveStoreDetails} className="space-y-4 bg-teal-500/5 p-6 rounded-3xl border border-teal-500/20">
                                        {storeUpdateMsg && (
                                            <div className="bg-teal-500/10 border border-teal-500/50 text-teal-400 px-4 py-3 rounded-xl text-sm font-medium">
                                                {storeUpdateMsg}
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">Bank Name</label>
                                                <input type="text" value={storeSettings.bankName} onChange={e => setStoreSettings({...storeSettings, bankName: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="e.g. Meezan Bank" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">Account Title</label>
                                                <input type="text" value={storeSettings.accountTitle} onChange={e => setStoreSettings({...storeSettings, accountTitle: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="e.g. Glass Apparel" required />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">Account Number (IBAN)</label>
                                                <input type="text" value={storeSettings.accountNumber} onChange={e => setStoreSettings({...storeSettings, accountNumber: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="PK00 MEZN 0000..." required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">EasyPaisa Details</label>
                                                <input type="text" value={storeSettings.easyPaisa} onChange={e => setStoreSettings({...storeSettings, easyPaisa: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="0300 0000000 (Title)" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">JazzCash Details</label>
                                                <input type="text" value={storeSettings.jazzCash} onChange={e => setStoreSettings({...storeSettings, jazzCash: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="0300 0000000 (Title)" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">COD Advance Amount (RS)</label>
                                                <input type="number" value={storeSettings.advanceAmount} onChange={e => setStoreSettings({...storeSettings, advanceAmount: Number(e.target.value)})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)]" placeholder="250" required />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-[var(--text-muted)]">Checkout Disclaimer Notice</label>
                                                <textarea rows="2" value={storeSettings.disclaimer} onChange={e => setStoreSettings({...storeSettings, disclaimer: e.target.value})} className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-400 text-[var(--text-main)] resize-none" placeholder="Notice displayed to customers..." required />
                                            </div>
                                        </div>

                                        <button type="submit" disabled={isSavingStore} className="w-full mt-4 px-6 py-3 rounded-xl bg-[var(--text-main)] text-[var(--bg-1)] font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
                                            {isSavingStore ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                            {isSavingStore ? 'Saving...' : 'Save Store Details'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminView;