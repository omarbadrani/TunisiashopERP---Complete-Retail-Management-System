
import React, { useState } from 'react';
import { Search, Plus, Truck, Phone, ChevronRight, DollarSign } from 'lucide-react';
import { Supplier } from '../types';
import { formatCurrency } from '../utils';
import Modal from './Modal';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: (s: Supplier) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddSupplier }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    debt: 0
  });

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier: Supplier = {
      ...newSupplier as Supplier,
      id: 's' + (suppliers.length + 1),
    };
    onAddSupplier(supplier);
    setIsModalOpen(false);
    setNewSupplier({ name: '', contact: '', debt: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-black outline-none font-black text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-slate-900 transition-colors shadow-lg font-black text-sm uppercase"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouveau Fournisseur
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(supplier => (
          <div key={supplier.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center group hover:border-black transition-all">
            <div className="h-16 w-16 rounded-2xl bg-black flex items-center justify-center text-white mr-4 shadow-md">
              <Truck className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-black uppercase tracking-tight">{supplier.name}</h3>
              <p className="text-sm text-black font-bold flex items-center opacity-60">
                <Phone className="h-3 w-3 mr-1" /> {supplier.contact}
              </p>
            </div>
            <div className="text-right mr-6">
              <p className="text-[10px] text-black uppercase font-black tracking-widest opacity-40">Dette Totale</p>
              <p className={`text-xl font-black ${supplier.debt > 0 ? 'text-red-600' : 'text-black'}`}>
                {formatCurrency(supplier.debt)}
              </p>
            </div>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
              <ChevronRight className="h-6 w-6 text-black" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-20 text-center text-black font-black uppercase tracking-widest opacity-20 border-4 border-dashed rounded-[40px] border-slate-200">
          <Truck className="h-12 w-12 mx-auto mb-4" />
          Aucun fournisseur trouvé
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un fournisseur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-1.5">Nom du Fournisseur</label>
            <input 
              required
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none text-black font-black text-sm uppercase"
              placeholder="Ex: Délice Danone Tunisie"
              value={newSupplier.name}
              onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-1.5">Contact / Téléphone</label>
            <input 
              required
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none text-black font-black text-sm"
              placeholder="Ex: 71 000 000"
              value={newSupplier.contact}
              onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-1.5">Dette Initiale (TND)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <input 
                required type="number" step="0.001"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-none text-black font-black text-lg"
                value={newSupplier.debt}
                onChange={e => setNewSupplier({...newSupplier, debt: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
              ENREGISTRER LE FOURNISSEUR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
