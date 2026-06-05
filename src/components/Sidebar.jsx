import React from 'react';
import { X, Home, ShoppingBag, Layers, Moon, Sun, Shield } from 'lucide-react';

const Sidebar = ({ view, isSidebarOpen, setSidebarOpen, handleNavigate, theme, toggleTheme, user }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shirts', icon: Layers, label: 'Shirts' },
    { id: 'pants', icon: Layers, label: 'Pants' },
    { id: 'combinations', icon: ShoppingBag, label: 'Pairs' }
  ];

  return (
    <aside className={`
      group 
      fixed top-0 left-0 h-full z-50 glass-panel border-r border-[var(--glass-border)]
      transition-all duration-500 ease-in-out text-[var(--text-main)]
      flex flex-col py-8 overflow-hidden
      ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 lg:hover:w-64'}
    `}>
      <div className="flex items-center justify-between px-6 mb-12">
        <div className={`font-bold text-2xl tracking-wider truncate transition-opacity duration-300 ${!isSidebarOpen ? 'lg:opacity-0 lg:hidden lg:group-hover:opacity-100 lg:group-hover:block' : ''}`}>
          VINTAGE
        </div>
        <button className="lg:hidden hover:text-teal-400 transition-colors" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-4 px-4 overflow-hidden w-full flex-1">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`
              flex items-center gap-4 p-3 rounded-2xl glass-button whitespace-nowrap hover:text-teal-400 transition-colors
              ${view === item.id ? 'bg-[var(--glass-bg)] border-teal-400/50 shadow-lg text-teal-400' : ''}
            `}
          >
            <item.icon size={24} className="shrink-0" />
            <span className={`font-semibold tracking-wide transition-opacity duration-300 ${!isSidebarOpen ? 'lg:opacity-0 lg:hidden lg:group-hover:opacity-100 lg:group-hover:block' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}

        {/* Admin Button with Condition */}
        {user?.role === 'admin' && (
          <button 
            onClick={() => handleNavigate('admin')}
            className={`
              flex items-center gap-4 p-3 rounded-2xl glass-button whitespace-nowrap hover:text-teal-400 transition-colors
              ${view === 'admin' ? 'bg-[var(--glass-bg)] border-teal-400/50 shadow-lg text-teal-400' : ''}
            `}
          >
            <Shield size={24} className="shrink-0 text-red-400" />
            <span className={`font-semibold tracking-wide transition-opacity duration-300 ${!isSidebarOpen ? 'lg:opacity-0 lg:hidden lg:group-hover:opacity-100 lg:group-hover:block' : ''}`}>
              Admin
            </span>
          </button>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;