import React, { useState, useRef } from 'react';
import { X, Sparkles, Loader2, Save, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'clothing' | 'accessories' | 'toys'>('clothing');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!name || !price) return;
    
    setIsGenerating(true);
    try {
      const desc = await generateProductDescription(name, category, Number(price));
      setDescription(desc);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: Number(price),
      category,
      description: description || 'Producto increíble para tu bebé.',
      image: image || `https://picsum.photos/seed/${Date.now()}/400/400`
    };
    onAdd(newProduct);
    
    // Reset
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pink-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-pink-500 w-5 h-5 animate-pulse" />
            Agregar Producto
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="flex justify-center">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {image ? (
              <div className="relative group w-full h-48 rounded-xl overflow-hidden border-2 border-pink-100 animate-fade-in">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-slate-700 hover:text-pink-500 transition-colors transform hover:scale-110"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => setImage('')}
                        className="p-2 bg-white rounded-full text-slate-700 hover:text-red-500 transition-colors transform hover:scale-110"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50 transition-all gap-2 group"
              >
                <div className="p-3 bg-slate-100 rounded-full text-slate-400 group-hover:text-pink-500 transition-colors group-hover:scale-110">
                    <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Subir foto del producto</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Producto</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Body Estrellitas Mágicas"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Precio (ARS)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej. 15000"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white transition-shadow"
              >
                <option value="clothing">Ropa</option>
                <option value="accessories">Accesorios</option>
                <option value="toys">Juguetes</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-slate-700">Descripción</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={!name || !price || isGenerating}
                className="text-xs flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold hover:shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {isGenerating ? 'Creando...' : 'Magia AI'}
              </button>
            </div>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hacé clic en 'Magia AI' para que escribamos una descripción increíble por vos..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none text-slate-600 bg-slate-50 transition-shadow"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              Publicar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;