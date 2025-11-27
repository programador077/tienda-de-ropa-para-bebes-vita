import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, CreditCard, QrCode, CheckCircle2, ChevronLeft, Loader2, Smartphone } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success';

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onUpdateQty }) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedMethod, setSelectedMethod] = useState<'mp' | 'cards' | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleClose = () => {
    onClose();
    // Reset state after a delay to smooth out close animation
    setTimeout(() => {
        setStep('cart');
        setSelectedMethod(null);
    }, 300);
  };

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const renderContent = () => {
    switch (step) {
      case 'cart':
        return (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 animate-scale-in">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Tu carrito está vacío.</p>
                  <button onClick={handleClose} className="text-pink-500 font-semibold hover:underline">
                    Ver productos
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h3>
                        <p className="text-pink-500 font-bold">${item.price.toLocaleString('es-AR')}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-slate-800">${total.toLocaleString('es-AR')}</span>
                </div>
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Iniciar Compra
                </button>
              </div>
            )}
          </div>
        );

      case 'payment':
        return (
          <div className="flex-1 flex flex-col p-5 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Seleccioná cómo pagar</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedMethod('mp')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:scale-[1.02] ${selectedMethod === 'mp' ? 'border-[#009EE3] bg-[#009EE3]/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
              >
                <div className="w-12 h-12 bg-[#009EE3]/10 rounded-full flex items-center justify-center text-[#009EE3]">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <span className="block font-bold text-slate-800">Mercado Pago</span>
                  <span className="text-sm text-slate-500">Dinero en cuenta, QR, Débito</span>
                </div>
                {selectedMethod === 'mp' && <div className="w-4 h-4 rounded-full bg-[#009EE3] animate-scale-in" />}
              </button>

              <button 
                onClick={() => setSelectedMethod('cards')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:scale-[1.02] ${selectedMethod === 'cards' ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
              >
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <span className="block font-bold text-slate-800">Tarjetas</span>
                  <span className="text-sm text-slate-500">Visa, Mastercard, Amex, Cabal</span>
                </div>
                {selectedMethod === 'cards' && <div className="w-4 h-4 rounded-full bg-pink-500 animate-scale-in" />}
              </button>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 font-medium">Total</span>
                  <span className="text-xl font-bold text-slate-800">${total.toLocaleString('es-AR')}</span>
              </div>
              <button 
                onClick={handlePayment}
                disabled={!selectedMethod}
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-[0.98]"
              >
                Pagar con {selectedMethod === 'mp' ? 'Mercado Pago' : 'Tarjeta'}
              </button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in">
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin" />
            <div className="animate-pulse">
              <h3 className="text-xl font-bold text-slate-800">Procesando pago...</h3>
              <p className="text-slate-500 mt-2">Estamos conectando con {selectedMethod === 'mp' ? 'Mercado Pago' : 'tu banco'}.</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2 animate-float">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">¡Pago Exitoso!</h3>
              <p className="text-slate-500 mt-2">Gracias por tu compra en BabyVita.</p>
              <p className="text-sm text-slate-400 mt-1">Te enviamos el comprobante por email.</p>
            </div>
            <button 
              onClick={handleClose}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              Seguir comprando
            </button>
          </div>
        );
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
             {step === 'payment' && (
                <button onClick={() => setStep('cart')} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
             )}
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {step === 'cart' && <><ShoppingBag className="w-5 h-5" /> Tu Carrito</>}
              {step === 'payment' && 'Confirmar Pago'}
              {(step === 'success' || step === 'processing') && 'Checkout'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default CartDrawer;