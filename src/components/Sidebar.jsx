import React from 'react';
import { X, Home, ShoppingBag, Layers, Settings } from 'lucide-react';

export const Sidebar = ({ view, isSidebarOpen, setSidebarOpen, handleNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shirts', icon: Layers, label: 'Shirts' },
    { id: 'pants', icon: Layers, label: 'Pants' },
    { id: 'combinations', icon: ShoppingBag, label: 'Pairs' },
    { id: 'admin', icon: Settings, label: 'Data Update' },
  ];

  return (
    <aside className={`
      fixed top-0 left-0 h-full z-50 glass-panel border-r border-white/10
      transition-all duration-500 ease-in-out
      flex flex-col py-8 group
      ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 lg:hover:w-64'}
    `}>
      <div className="flex items-center justify-between px-6 mb-12">
        <div className={`font-bold text-2xl tracking-wider truncate transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:hidden'}`}>
          GLASS
        </div>
        <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-4 px-4 overflow-hidden w-full">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`
              flex items-center gap-4 p-3 rounded-2xl glass-button whitespace-nowrap group
              ${view === item.id ? 'bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
            `}
          >
            <item.icon size={24} className="shrink-0" />
            <span className={`font-semibold tracking-wide transition-all duration-300 ${!isSidebarOpen ? 'lg:hidden lg:opacity-0 lg:group-hover:inline-flex lg:group-hover:opacity-100' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
export default Sidebar;