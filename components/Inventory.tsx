
import React, { useState, useRef } from 'react';
import { Search, Plus, Printer, Barcode, RefreshCw, Image as ImageIcon, Edit3, Trash2, Upload, X, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, isNearExpiry, isExpired } from '../utils';
import Modal from './Modal';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  storeSettings?: any;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, storeSettings }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LOW_STOCK' | 'NEAR_EXPIRY'>('ALL');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: 'Épicerie', barcode: '', buyPrice: 0, sellPrice: 0, discountPercentage: 0, tva: 19, stockQuantity: 0, minStock: 5, expiryDate: '', imageUrl: ''
  });

  const [stockAdjustment, setStockAdjustment] = useState<{ type: 'ADD' | 'SUBTRACT', quantity: number }>({ type: 'ADD', quantity: 0 });

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    if (filter === 'LOW_STOCK') return matchesSearch && p.stockQuantity <= p.minStock;
    if (filter === 'NEAR_EXPIRY') return matchesSearch && (isNearExpiry(p.expiryDate) || isExpired(p.expiryDate));
    return matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', category: 'Épicerie', barcode: '', buyPrice: 0, sellPrice: 0, discountPercentage: 0, tva: 19, stockQuantity: 0, minStock: 5, expiryDate: '', imageUrl: ''
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...productForm } as Product);
    } else {
      const barcode = productForm.barcode || "619" + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
      onAddProduct({ ...productForm as Product, id: Math.random().toString(36).substr(2, 9), barcode });
    }
    setIsProductModalOpen(false);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const adj = stockAdjustment.type === 'ADD' ? stockAdjustment.quantity : -stockAdjustment.quantity;
    onUpdateProduct({ ...selectedProduct, stockQuantity: Math.max(0, selectedProduct.stockQuantity + adj) });
    setIsStockModalOpen(false);
    setStockAdjustment({ type: 'ADD', quantity: 0 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductForm(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button onClick={() => setFilter('ALL')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>Tous</button>
          <button onClick={() => setFilter('LOW_STOCK')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === 'LOW_STOCK' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>Stock Bas</button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input type="text" placeholder="Rechercher par nom ou code..." className="w-full pl-12 pr-4 py-3 border-2 border-white rounded-2xl outline-none shadow-sm bg-white font-bold text-slate-700 focus:border-indigo-400 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex space-x-2">
          <button onClick={handlePrint} className="flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 font-black text-xs uppercase shadow-sm">
            <Printer className="h-4 w-4 mr-2" /> PDF
          </button>
          <button onClick={openAddModal} className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl hover:scale-105 font-black text-xs uppercase shadow-xl shadow-indigo-100 transition-all">
            <Plus className="h-4 w-4 mr-2" /> Produit
          </button>
        </div>
      </div>

      <div className="no-print bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aperçu</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Désignation</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="h-12 w-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      )}
                      {product.discountPercentage ? (
                        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[7px] font-black p-0.5 rounded-bl-lg">
                          -{product.discountPercentage}%
                        </div>
                      ) : null}
                   </div>
                </td>
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors uppercase">{product.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center mt-1">
                    <Barcode className="h-3 w-3 mr-1" /> {product.barcode}
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${product.stockQuantity <= product.minStock ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Modifier">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setSelectedProduct(product); setStockAdjustment({type: 'ADD', quantity: 0}); setIsStockModalOpen(true); }} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white text-[9px] font-black uppercase transition-all">Stock</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isStockModalOpen && (
        <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title={`Stock : ${selectedProduct?.name}`}>
           <form onSubmit={handleStockSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-center">Quantité à modifier</label>
                <input required type="number" className="w-full p-6 border-2 border-slate-100 bg-slate-50 rounded-[28px] text-5xl font-black text-center outline-none text-indigo-600 focus:border-indigo-400 transition-all" value={stockAdjustment.quantity || ''} onChange={e => setStockAdjustment({...stockAdjustment, quantity: parseInt(e.target.value) || 0})} placeholder="0" />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setStockAdjustment({...stockAdjustment, type: 'ADD'})} className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase border-2 transition-all shadow-sm ${stockAdjustment.type === 'ADD' ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-100' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}>+ Arrivage</button>
                <button type="button" onClick={() => setStockAdjustment({...stockAdjustment, type: 'SUBTRACT'})} className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase border-2 transition-all shadow-sm ${stockAdjustment.type === 'SUBTRACT' ? 'bg-red-500 text-white border-red-500 shadow-red-100' : 'bg-white text-red-600 border-red-100 hover:bg-red-50'}`}>- Déstockage</button>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase text-xs tracking-widest mt-4 hover:bg-black transition-all shadow-xl">Appliquer les changements</button>
           </form>
        </Modal>
      )}

      {isProductModalOpen && (
        <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? "Modifier Produit" : "Nouveau Produit"}>
           <form onSubmit={handleProductSubmit} className="space-y-5">
              <div className="flex flex-col items-center mb-4">
                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="h-32 w-32 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 group-hover:bg-indigo-50">
                       {productForm.imageUrl ? (
                         <img src={productForm.imageUrl} className="h-full w-full object-cover" alt="Preview" />
                       ) : (
                         <>
                           <Upload className="h-8 w-8 text-slate-300 mb-2" />
                           <span className="text-[10px] font-black text-slate-400 uppercase">Image</span>
                         </>
                       )}
                    </div>
                    {productForm.imageUrl && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   className="hidden" 
                   accept="image/*"
                 />
                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-3">Cliquez pour {productForm.imageUrl ? 'changer' : 'ajouter'} l'image</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Désignation</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 text-slate-800 font-bold" placeholder="Nom du produit" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Code-Barres</label>
                  <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-indigo-400 text-slate-800 font-mono" placeholder="Automatique si vide" value={productForm.barcode} onChange={e => setProductForm({...productForm, barcode: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Remise (%)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                    <input type="number" min="0" max="100" className="w-full pl-12 pr-4 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl outline-none focus:bg-white focus:border-rose-400 text-rose-600 font-black" placeholder="Ex: 10" value={productForm.discountPercentage || ''} onChange={e => setProductForm({...productForm, discountPercentage: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">P. Achat</label>
                  <input required type="number" step="0.001" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800" value={productForm.buyPrice} onChange={e => setProductForm({...productForm, buyPrice: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">P. Vente (Base)</label>
                  <input required type="number" step="0.001" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-indigo-600" value={productForm.sellPrice} onChange={e => setProductForm({...productForm, sellPrice: parseFloat(e.target.value)})} />
                </div>
              </div>

              {!editingProduct && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stock Initial</label>
                  <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800" value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: parseInt(e.target.value)})} />
                </div>
              )}

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 mt-4 uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all">
                {editingProduct ? "Mettre à jour" : "Enregistrer au Catalogue"}
              </button>
           </form>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
