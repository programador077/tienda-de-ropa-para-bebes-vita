import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import ChatBot from './components/ChatBot';
import StoreLocator from './components/StoreLocator';
import AddProductModal from './components/AddProductModal';
import { Product, CartItem } from './types';
import { PRODUCTS } from './constants';

function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'locator'>('home');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setCurrentView('home');
    // Optional: Scroll to top to see new product
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header 
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        currentView={currentView}
        onNavClick={setCurrentView}
        onSellClick={() => setIsAddProductOpen(true)}
      />

      <main className="pt-6">
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="relative mx-4 sm:mx-6 lg:mx-8 rounded-3xl overflow-hidden shadow-lg mb-8 animate-fade-in-up">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-purple-600/60 z-10 flex items-center pl-8 sm:pl-16">
                 <div className="max-w-xl text-white">
                   <h2 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>Suavidad para tu bebé</h2>
                   <p className="text-lg sm:text-xl opacity-90 mb-6 drop-shadow animate-fade-in-up" style={{ animationDelay: '400ms' }}>Descubrí nuestra colección sustentable y orgánica diseñada para su confort.</p>
                   <button 
                     onClick={() => window.scrollTo({top: 500, behavior: 'smooth'})} 
                     className="px-8 py-3 bg-white text-pink-600 font-bold rounded-full hover:bg-slate-100 transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 animate-fade-in-up"
                     style={{ animationDelay: '600ms' }}
                   >
                     Ver Colección
                   </button>
                 </div>
               </div>
               <img 
                 src="https://picsum.photos/seed/babyhero/1600/600" 
                 alt="Baby sleeping" 
                 className="w-full h-[400px] object-cover animate-float"
               />
            </div>

            <ProductList 
              products={products} 
              onAddToCart={addToCart} 
              onAddProduct={() => setIsAddProductOpen(true)}
            />
          </>
        ) : (
          <StoreLocator />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
      />

      <AddProductModal 
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAdd={handleAddProduct}
      />

      <ChatBot />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
          <p className="mb-2">© 2024 BabyVita. Todos los derechos reservados.</p>
          <p className="text-sm font-semibold text-pink-500">La Rioja Capital, Argentina ❤️</p>
          <p className="text-xs mt-2 text-slate-400">Desarrollado con React, Tailwind y Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;