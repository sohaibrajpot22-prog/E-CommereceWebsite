import React, { useState } from 'react';
import { Trash2, Plus, Edit2, Package, Layers, Shirt, Save, X, ClipboardList, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const AdminView = ({ db, setDb }) => {
  const [activeTab, setActiveTab] = useState('orders'); // Default tab orders
  const [editingId, setEditingId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null); // Kis order ki details kholi hain
  
  const [formData, setFormData] = useState({
    name: '', price: '', image: '', description: '', 
    quantity: 10, sizes: 'S,M,L,XL', colors: 'Blue,Navy,White'
  });

  // ORDER MANAGEMENT
  const updateOrderStatus = (orderId, newStatus) => {
    setDb(prev => ({
      ...prev,
      orders: prev.orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
    }));
  };

  // PRODUCT CRUD MANAGEMENT
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name, price: item.price, image: item.image, description: item.description,
      quantity: item.quantity, sizes: item.sizes?.join(',') || '', colors: item.colors?.map(c => c.name || c).join(',') || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name, price: formData.price, description: formData.description, image: formData.image,
      quantity: parseInt(formData.quantity),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim())
    };

    if (editingId) {
      setDb(prev => ({ ...prev, [activeTab]: prev[activeTab].map(item => item.id === editingId ? newItem : item) }));
      setEditingId(null);
    } else {
      setDb(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
    }
    setFormData({ name: '', price: '', image: '', description: '', quantity: 10, sizes: 'S,M,L,XL', colors: 'Blue,Navy,White' });
  };

  const handleDelete = (id) => {
    setDb(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(item => item.id !== id) }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 w-full">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight text-[var(--text-main)]">Admin Dashboard</h2>
        <p className="text-[var(--text-muted)] mt-2">Manage Orders & Store Inventory</p>
      </div>

      <div className="flex gap-2 bg-[var(--glass-bg)] p-1 rounded-2xl w-fit mb-8 border border-[var(--glass-border)] flex-wrap">
        {[
          { id: 'orders', icon: <ClipboardList size={18}/> },
          { id: 'shirts', icon: <Shirt size={18}/> },
          { id: 'pants', icon: <Package size={18}/> },
          { id: 'combinations', icon: <Layers size={18}/> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold capitalize transition-all ${activeTab === tab.id ? 'bg-[var(--text-main)] text-[var(--bg-1)] shadow-lg' : 'text-[var(--text-muted)] hover:bg-white/5'}`}>
            {tab.icon} <span className="hidden sm:inline">{tab.id}</span>
          </button>
        ))}
      </div>

      {activeTab === 'orders' ? (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-main)] mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {(!db.orders || db.orders.length === 0) && <p className="text-[var(--text-muted)]">No orders placed yet.</p>}
            
            {db.orders && db.orders.map(order => (
              <div key={order.id} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl overflow-hidden transition-all">
                {/* Order Header */}
                <div onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="p-4 flex flex-wrap items-center justify-between cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold"><Package size={20}/></div>
                    <div>
                      <h4 className="font-bold text-[var(--text-main)]">{order.customer} <span className="text-[var(--text-muted)] text-xs ml-2 font-mono">{order.id}</span></h4>
                      <p className="text-[var(--text-muted)] text-sm">{order.date} • {order.items.length} Items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <span className="font-bold text-[var(--text-main)]">${order.total}</span>
                    <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-none focus:outline-none appearance-none cursor-pointer ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}
                      >
                        <option value="Pending" className="bg-[var(--bg-2)] text-white">Pending</option>
                        <option value="Shipped" className="bg-[var(--bg-2)] text-white">Shipped</option>
                        <option value="Delivered" className="bg-[var(--bg-2)] text-white">Delivered</option>
                    </select>
                    {expandedOrder === order.id ? <ChevronUp size={20} className="text-[var(--text-muted)]"/> : <ChevronDown size={20} className="text-[var(--text-muted)]"/>}
                  </div>
                </div>

                {/* Order Details (Sizes, Colors, Address) */}
                {expandedOrder === order.id && (
                  <div className="p-4 border-t border-[var(--glass-border)] bg-black/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Ordered Items</p>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                              <img src={item.image} className="w-12 h-12 rounded-lg object-cover border border-[var(--glass-border)]" />
                              <div>
                                <p className="text-sm font-bold text-[var(--text-main)] line-clamp-1">{item.name}</p>
                                <p className="text-xs text-teal-400 font-semibold">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wider">Shipping Details</p>
                          <p className="text-sm text-[var(--text-main)]">{order.shippingAddress?.detail}, {order.shippingAddress?.city}</p>
                          <p className="text-sm text-[var(--text-muted)] mt-1">Phone: <span className="text-teal-400">{order.shippingAddress?.phone}</span></p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wider">Payment Method</p>
                          <p className="text-sm text-[var(--text-main)] capitalize font-semibold">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Transfer'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="space-y-4">
                    {db[activeTab].map(item => (
                    <div key={item.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-[var(--glass-border)] hover:border-teal-400/30 transition-all">
                        <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                            <p className="font-bold text-[var(--text-main)]">{item.name}</p>
                            <p className="text-teal-400 text-sm font-bold">${item.price} • Stock: {item.quantity}</p>
                        </div>
                        </div>
                        <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-3 text-[var(--text-muted)] hover:text-blue-400 transition">
                            <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-3 text-[var(--text-muted)] hover:text-red-400 transition">
                            <Trash2 size={20} />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl space-y-4 h-fit sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Product Name" required />
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Price ($)" required />
                <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Warehouse Quantity" required />
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400 h-24" placeholder="Product Description" required />
                <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Sizes (Comma separated: S,M,L)" />
                <input type="text" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Colors (Comma separated: Blue,Navy)" />
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[var(--bg-2)] border border-[var(--glass-border)] rounded-xl p-4 text-[var(--text-main)] focus:outline-none focus:border-teal-400" placeholder="Image URL" required />
                
                <button type="submit" className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-400 transition shadow-lg shadow-teal-500/30">
                    {editingId ? <Save size={20} /> : <Plus size={20} />} {editingId ? 'Save Changes' : 'Add Item'}
                </button>
                {editingId && (
                    <button type="button" onClick={() => setEditingId(null)} className="w-full bg-gray-500/20 text-[var(--text-main)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-500/40">
                    <X size={20} /> Cancel
                    </button>
                )}
            </form>
        </div>
      )}
    </div>
  );
};

export default AdminView;