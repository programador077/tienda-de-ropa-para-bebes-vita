import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddProduct: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, onAddProduct }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-slate-800 text-center sm:text-left">
          Novedades
        </h2>
        <button 
          onClick={onAddProduct}
          className="flex items-center gap-2 px-6 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-all hover:scale-105 active:scale-95 font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Add Product Card */}
        <button 
            onClick={onAddProduct}
            className="group min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 cursor-pointer animate-fade-in-up hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: '0ms' }}
        >
            <div className="w-16 h-16 bg-white shadow-sm text-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold text-lg text-slate-600 group-hover:text-pink-600 transition-colors">Agregar Nuevo</span>
            <span className="text-sm text-slate-400 mt-2 px-4 text-center">Publicá tu ropa de bebé fácil y rápido</span>
        </button>

        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden animate-fade-in-up hover:-translate-y-2"
            style={{ animationDelay: `${(index + 1) * 50}ms`, opacity: 0 }} // Start opacity 0 to let animation handle fade in
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-pink-600 p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs font-semibold text-pink-500 uppercase tracking-wide mb-1">
                {product.category === 'clothing' ? 'Ropa' : product.category === 'toys' ? 'Juguetes' : 'Accesorios'}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-slate-800">
                  ${product.price.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;