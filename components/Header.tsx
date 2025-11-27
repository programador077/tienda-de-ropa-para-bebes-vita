import React from 'react';
import { ShoppingBag, ShoppingCart, MapPin, PlusCircle } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  currentView: 'home' | 'locator';
  onNavClick: (view: 'home' | 'locator') => void;
  onSellClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, currentView, onNavClick, onSellClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavClick('home')}
          >
            <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
              <ShoppingBag className="w-6 h-6 text-pink-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Baby<span className="text-pink-500">Vita</span>
            </h1>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavClick('home')}
              className={`text-sm font-semibold transition-colors ${currentView === 'home' ? 'text-pink-500' : 'text-slate-600 hover:text-pink-500'}`}
            >
              Tienda
            </button>
            <button 
              onClick={() => onNavClick('locator')}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${currentView === 'locator' ? 'text-pink-500' : 'text-slate-600 hover:text-pink-500'}`}
            >
              <MapPin className="w-4 h-4" />
              Sucursales
            </button>
            <button
              onClick={onSellClick}
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-pink-500 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Vender
            </button>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
             <button 
              onClick={() => onNavClick('locator')}
              className="md:hidden p-2 text-slate-600"
             >
                <MapPin className="w-6 h-6" />
             </button>
             
             <button 
              onClick={onSellClick}
              className="md:hidden p-2 text-slate-600"
             >
                <PlusCircle className="w-6 h-6" />
             </button>

            <button 
              className="relative p-2 text-slate-600 hover:bg-pink-50 rounded-full transition-colors"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-500 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;