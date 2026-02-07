
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Minus, Trash2, Printer, ShoppingCart, 
  Barcode, CreditCard, Banknote, User as UserIcon, 
  Clock, Monitor, Search, Layers, Package, 
  ChevronRight, Coins, ArrowRight, Calculator,
  Wifi, UserCheck, X, Delete, Eraser, Hash, Camera, ScanLine, CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { Product, CartItem, Customer, Sale, StoreSettings } from '../types';
import { formatCurrency } from '../utils';
import { CATEGORIES } from '../constants';

interface POSProps {
  products: Product[];
  customers: Customer[];
  onCompleteSale: (sale: Sale) => void;
  currentUser: any;
  settings: StoreSettings;
}

const POS: React.FC<POSProps> = ({ products, customers, onCompleteSale, currentUser, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flashAdd, setFlashAdd] = useState(false);
  
  // Numpad state
  const [numpadValue, setNumpadValue] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<number>(0);

  const subtotal = cart.reduce((acc, item) => acc + (item.sellPrice * item.quantity), 0);
  const total = subtotal + (settings.taxStampEnabled ? settings.taxStampAmount : 0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Keep focus on search for scanner
    const focusTimer = setInterval(() => {
        if (!showReceipt && !showScanner && document.activeElement?.tagName !== 'INPUT') {
            searchInputRef.current?.focus();
        }
    }, 1000);

    return () => {
        clearInterval(timer);
        clearInterval(focusTimer);
    };
  }, [showReceipt, showScanner]);

  const addToCart = (product: Product, customQty?: number) => {
    if (product.stockQuantity <= 0) return;
    
    // Logic: Use numpad value if exists, otherwise 1
    const qtyToApply = customQty || (numpadValue !== '' ? parseInt(numpadValue) : 1);
    if (isNaN(qtyToApply) || qtyToApply <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const price = product.discountPercentage ? product.sellPrice * (1 - product.discountPercentage / 100) : product.sellPrice;
      
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qtyToApply } : item);
      }
      return [{ ...product, sellPrice: price, quantity: qtyToApply }, ...prev];
    });

    // Feedback
    setFlashAdd(true);
    setTimeout(() => setFlashAdd(false), 300);

    setSelectedItemId(product.id);
    setNumpadValue('');
    setSearchTerm('');
    if (showScanner) stopScanner();
    searchInputRef.current?.focus();
  };

  // Handle Handheld Scanner (Douchette)
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const product = products.find(p => p.barcode === searchTerm || p.name.toLowerCase() === searchTerm.toLowerCase());
      if (product) {
        addToCart(product);
      } else {
        // If not found by exact barcode, maybe it's a partial name, but in superette we usually clear if not found
        setSearchTerm('');
      }
    }
  };

  const updateQuantityFromNumpad = () => {
    if (!selectedItemId || numpadValue === '') return;
    const newQty = parseInt(numpadValue);
    if (isNaN(newQty) || newQty < 1) return;

    setCart(prev => prev.map(item => item.id === selectedItemId ? { ...item, quantity: newQty } : item));
    setNumpadValue('');
    searchInputRef.current?.focus();
  };

  const handleNumpadClick = (val: string) => {
    setNumpadValue(prev => prev + val);
  };
  
  const clearNumpad = () => setNumpadValue('');

  const handlePayment = (method: 'CASH' | 'CARD') => {
    if (cart.length === 0) return;
    if (method === 'CASH' && numpadValue !== '') setCashReceived(parseFloat(numpadValue));

    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      items: [...cart],
      total,
      subtotal,
      taxAmount: subtotal * 0.19,
      taxStamp: settings.taxStampEnabled ? settings.taxStampAmount : 0,
      paymentMethod: method,
      cashierId: currentUser.id,
    };

    setLastSale(sale);
    onCompleteSale(sale);
    setCart([]);
    setSelectedItemId(null);
    setNumpadValue('');
    setCashReceived(0);
    setShowReceipt(true);
  };

  const handleReprintLastTicket = () => {
    if (lastSale) {
      setShowReceipt(true);
    } else {
      alert("Aucune vente enregistrée pour le moment.");
    }
  };

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Erreur caméra.");
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setShowScanner(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm);
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#020617] text-white overflow-hidden select-none font-sans">
      
      {/* LEFT: TICKET & CONTROLS */}
      <div className={`w-[440px] flex flex-col bg-slate-900 border-r border-slate-800 shadow-2xl z-20 transition-all duration-300 ${flashAdd ? 'ring-4 ring-indigo-500 ring-inset' : ''}`}>
        
        <div className="h-10 bg-indigo-950/50 flex items-center justify-between px-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">
           <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {currentTime.toLocaleTimeString('fr-TN')}</div>
           <div className="flex items-center gap-2 font-bold"><Monitor className="h-3 w-3" /> CAISSE #01</div>
        </div>

        {/* LISTE DES ARTICLES */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white text-slate-900 shadow-inner">
           {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-10">
                <Barcode className="h-24 w-24 mb-4" />
                <p className="font-black uppercase text-sm tracking-[0.3em]">Attente Scan...</p>
             </div>
           ) : (
             <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-slate-100 text-[9px] font-black uppercase tracking-widest z-10 text-slate-500 border-b border-slate-200">
                 <tr>
                   <th className="p-4">Produit</th>
                   <th className="p-4 text-center">Qté</th>
                   <th className="p-4 text-right">Total</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {cart.map((item) => (
                   <tr 
                    key={item.id} 
                    onClick={() => setSelectedItemId(item.id)}
                    className={`cursor-pointer transition-all ${selectedItemId === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50'}`}
                   >
                     <td className="p-4">
                        <div className="font-black text-[11px] uppercase leading-tight">{item.name}</div>
                        <div className={`text-[9px] font-bold mt-1 ${selectedItemId === item.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                           {item.barcode} • {formatCurrency(item.sellPrice)}
                        </div>
                     </td>
                     <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-md font-black text-sm ${selectedItemId === item.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                          {item.quantity}
                        </span>
                     </td>
                     <td className="p-4 text-right font-black text-sm tabular-nums">{formatCurrency(item.sellPrice * item.quantity)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>

        {/* ZONE DE TOTAL ET PAVE NUMERIQUE */}
        <div className="bg-slate-800 p-3 border-t border-slate-700">
           
           <div className="bg-black/60 rounded-2xl p-5 mb-3 border border-white/5 flex justify-between items-center shadow-2xl">
              <div>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Total à payer</span>
                 <div className="text-5xl font-black tabular-nums tracking-tighter text-white">
                    {total.toFixed(3)} <span className="text-xl text-slate-500 ml-1">TND</span>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 bg-emerald-950/50 px-2 py-0.5 rounded inline-block">Saisie Numérique</div>
                 <div className="text-3xl font-black text-emerald-400 tabular-nums min-w-[120px] h-12 flex items-center justify-end">
                    {numpadValue || '0'}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-4 gap-1.5">
              {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumpadClick(n.toString())} className="h-16 bg-white text-slate-900 rounded-xl font-black text-2xl shadow-md active:bg-indigo-100 active:scale-95 transition-all">{n}</button>)}
              <button onClick={() => setCart([])} className="h-16 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md hover:bg-rose-700 leading-tight">Annuler<br/>Vente</button>

              {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumpadClick(n.toString())} className="h-16 bg-white text-slate-900 rounded-xl font-black text-2xl shadow-md active:bg-indigo-100 active:scale-95 transition-all">{n}</button>)}
              <button onClick={updateQuantityFromNumpad} className="h-16 bg-amber-500 text-white rounded-xl font-black text-xl shadow-md hover:bg-amber-600 active:scale-95 transition-all">QTÉ</button>

              {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumpadClick(n.toString())} className="h-16 bg-white text-slate-900 rounded-xl font-black text-2xl shadow-md active:bg-indigo-100 active:scale-95 transition-all">{n}</button>)}
              <button onClick={() => handlePayment('CASH')} className="row-span-2 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase shadow-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all">
                 <Banknote className="h-8 w-8" />
                 ESPÈCES
              </button>

              <button onClick={() => handleNumpadClick('0')} className="h-16 bg-white text-slate-900 rounded-xl font-black text-2xl shadow-md">0</button>
              <button onClick={() => handleNumpadClick('.')} className="h-16 bg-white text-slate-900 rounded-xl font-black text-2xl shadow-md">.</button>
              <button onClick={clearNumpad} className="h-16 bg-slate-700 text-white rounded-xl font-black text-xs uppercase shadow-md">Effacer</button>
           </div>
           
           <button onClick={() => handlePayment('CARD')} className="w-full mt-3 py-5 bg-indigo-600 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl transition-all active:scale-95">
              <CreditCard className="h-6 w-6" /> TICKET / CARTE BANCAIRE
           </button>
        </div>
      </div>

      {/* MIDDLE: CATEGORIES (DRAWER STYLE) */}
      <div className="w-20 bg-slate-950 flex flex-col gap-1 p-1 overflow-y-auto no-scrollbar shrink-0 border-r border-white/5">
         {CATEGORIES.map(cat => (
           <button 
             key={cat.id} 
             onClick={() => setActiveCategory(cat.id)}
             className={`w-full py-5 rounded-xl font-black text-[8px] uppercase flex flex-col items-center justify-center gap-1 transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-900 text-slate-500 hover:text-slate-200'}`}
           >
             <span className="text-xl">{cat.icon}</span>
             <span className="text-center px-1 leading-tight">{cat.id}</span>
           </button>
         ))}
      </div>

      {/* RIGHT: PRODUCTS GRID & BARCODE SEARCH */}
      <div className="flex-1 flex flex-col bg-slate-950 relative">
         
         {/* BARRE DE RECHERCHE OPTIMISÉE DOUCHETTE */}
         <div className="p-4 bg-slate-900/50 border-b border-white/5 flex items-center gap-4">
            <div className="relative flex-1">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <Barcode className="h-5 w-5 text-indigo-500" />
                  <div className="h-4 w-px bg-slate-700"></div>
               </div>
               <input 
                 ref={searchInputRef}
                 type="text" 
                 placeholder="SCANNER CODE-BARRES ICI..." 
                 className="w-full pl-16 pr-6 py-5 bg-black rounded-[20px] outline-none text-xl font-black tracking-widest focus:ring-2 focus:ring-indigo-600 text-white placeholder:text-slate-700 border border-white/5 shadow-2xl"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 onKeyDown={handleSearchKeyDown}
                 autoFocus
               />
               <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-[9px] font-black text-slate-500">ENTRÉE</kbd>
               </div>
            </div>
            <button 
              onClick={startScanner}
              className="h-16 w-16 bg-slate-800 hover:bg-indigo-600 rounded-[20px] flex items-center justify-center transition-all shadow-lg border border-white/5"
            >
               <Camera className="h-7 w-7" />
            </button>
         </div>

         {/* GRILLE PRODUITS TACTILE */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3">
               {filteredProducts.map(product => (
                 <button 
                   key={product.id}
                   onClick={() => addToCart(product)}
                   className="aspect-square bg-slate-900 border border-white/5 rounded-[24px] p-4 flex flex-col items-center justify-between text-center group hover:bg-indigo-600 hover:border-indigo-400 transition-all active:scale-95 shadow-xl relative overflow-hidden"
                 >
                    <div className="h-20 w-20 mb-2 flex items-center justify-center bg-white rounded-2xl p-1.5 overflow-hidden shrink-0 shadow-sm">
                       <img src={product.imageUrl} className="h-full object-contain" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                       <h4 className="font-black text-[10px] uppercase leading-tight line-clamp-2 mb-1 group-hover:text-white text-slate-300">{product.name}</h4>
                       <div className="text-xs font-black text-indigo-400 group-hover:text-white bg-indigo-500/10 px-2 py-0.5 rounded-full">{formatCurrency(product.sellPrice)}</div>
                    </div>
                    {product.stockQuantity < 5 && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse"></div>
                    )}
                 </button>
               ))}
            </div>
         </div>

         {/* ACTIONS BAS DE PAGE */}
         <div className="p-3 bg-slate-900/80 backdrop-blur-md flex gap-3 border-t border-white/5">
            <button className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-300 transition-all flex items-center justify-center gap-3">
               <Hash className="h-4 w-4" /> Ouverture Tiroir
            </button>
            <button 
              onClick={handleReprintLastTicket}
              className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-300 transition-all flex items-center justify-center gap-3"
            >
               <Printer className="h-4 w-4" /> Imprimer Ticket
            </button>
            <button className="flex-1 py-5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-indigo-500/30">
               Clôture Journalière (Z)
            </button>
         </div>
      </div>

      {/* SCANNER OVERLAY (MODAL) */}
      {showScanner && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-72 h-48 border-2 border-indigo-500 rounded-[40px] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_20px_#6366f1] animate-[scan_2s_linear_infinite]"></div>
                </div>
                <p className="mt-8 font-black uppercase text-xs tracking-[0.3em] text-white">Lecture Optique Active</p>
            </div>
            <button onClick={stopScanner} className="absolute top-10 right-10 h-16 w-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20">
                <X className="h-8 w-8" />
            </button>
            <button 
                onClick={() => addToCart(products[Math.floor(Math.random()*products.length)])}
                className="absolute bottom-20 px-10 py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase text-xs tracking-widest shadow-2xl animate-pulse"
            >
                Simuler Détection Produit
            </button>
        </div>
      )}

      {/* TICKET CLIENT (APRES VENTE) */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 flex items-center justify-center z-[250] p-4 bg-black/90 backdrop-blur-lg">
          <div className="bg-white rounded-[50px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-12 font-mono text-[11px] text-slate-800 printable flex-1 overflow-y-auto no-scrollbar">
              <div className="text-center border-b-2 border-dashed border-slate-200 pb-10 mb-8">
                <h3 className="text-2xl font-black uppercase mb-1 tracking-tighter leading-tight">{settings.name}</h3>
                <p className="uppercase text-[9px] text-slate-500 mb-6">{settings.address}</p>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-4">
                   <div className="text-left">
                     <p>Ticket: #{lastSale.id}</p>
                     <p>Paiement: {lastSale.paymentMethod}</p>
                   </div>
                   <div className="text-right">
                     <p>{new Date(lastSale.timestamp).toLocaleDateString('fr-TN')}</p>
                     <p>{new Date(lastSale.timestamp).toLocaleTimeString('fr-TN')}</p>
                   </div>
                </div>
              </div>
              <div className="space-y-3 mb-10">
                {lastSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 uppercase font-bold text-[10px]">
                    <span className="flex-1">{item.name} x {item.quantity}</span>
                    <span className="tabular-nums">{formatCurrency(item.sellPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-dashed border-slate-200 pt-8 space-y-4">
                <div className="flex justify-between items-center text-5xl font-black tracking-tighter text-slate-900 tabular-nums">
                  <span className="text-sm self-start mt-2">TOTAL</span>
                  <span>{lastSale.total.toFixed(3)}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Mode de règlement</p>
                    <p className="text-lg font-black uppercase text-indigo-600">{lastSale.paymentMethod === 'CASH' ? 'ESPÈCES' : 'CARTE / TICKET'}</p>
                </div>
                <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mt-12">Merci de votre confiance</p>
              </div>
            </div>
            <div className="p-10 bg-slate-50 grid grid-cols-2 gap-4 no-print border-t border-slate-200">
              <button onClick={() => { window.print(); setShowReceipt(false); }} className="py-6 bg-slate-900 text-white rounded-[30px] font-black text-xs uppercase shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                <Printer className="h-5 w-5" /> Imprimer
              </button>
              <button onClick={() => setShowReceipt(false)} className="py-6 bg-white border-2 border-slate-200 text-slate-500 rounded-[30px] font-black text-xs uppercase hover:bg-slate-100 transition-all">Terminer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
