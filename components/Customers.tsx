
import React, { useState } from 'react';
import { Search, UserPlus, Phone, BookOpen, ChevronRight, User, Star } from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency } from '../utils';
import Modal from './Modal';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer: (c: Customer) => void;
  loyaltyEnabled: boolean; // New prop
}

const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer, loyaltyEnabled }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    creditBalance: 0,
    loyaltyPoints: 0
  });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCustomer as Customer,
      id: 'c' + (customers.length + 1),
      loyaltyPoints: 0
    };
    onAddCustomer(customer);
    setIsModalOpen(false);
    setNewCustomer({ name: '', phone: '', creditBalance: 0 });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 rounded-[32px] shadow-xl shadow-indigo-100 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Le Carnet de Crédit {loyaltyEnabled ? '& Fidélité' : ''}</h2>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">Gérez vos clients {loyaltyEnabled ? 'fidèles' : ''} et leur crédit</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase shadow-lg hover:scale-105 transition-all"
        >
          + Nouveau Client
        </button>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par nom ou téléphone..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none font-bold text-slate-700 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="px-6 text-xs font-black text-slate-400 uppercase tracking-widest">
           {filtered.length} CLIENTS TOTAL
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="h-16 w-16 rounded-[24px] bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:from-indigo-600 group-hover:to-indigo-500 group-hover:text-white transition-all duration-300">
                {customer.name.charAt(0)}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm border ${customer.creditBalance > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {customer.creditBalance > 0 ? 'Dette Active' : 'Solde OK'}
                </div>
                {loyaltyEnabled && (
                  <div className="flex items-center bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100 animate-in fade-in duration-300">
                    <Star className="h-3 w-3 mr-1 fill-amber-500" /> {customer.loyaltyPoints || 0} pts
                  </div>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-1 uppercase tracking-tighter">{customer.name}</h3>
            <div className="flex items-center text-sm text-slate-400 font-bold mb-8">
              <Phone className="h-4 w-4 mr-2 text-indigo-400" /> {customer.phone}
            </div>

            <div className="bg-slate-50 p-5 rounded-[28px] flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Crédit restant</p>
                <p className={`text-2xl font-black ${customer.creditBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {formatCurrency(customer.creditBalance)}
                </p>
              </div>
              <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 hover:border-indigo-400 hover:text-indigo-600 transition-all">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Client">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité du Client</label>
            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none text-slate-800 font-bold uppercase" placeholder="Nom et Prénom" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Numéro de Téléphone</label>
            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none text-slate-800 font-bold" placeholder="+216 -- --- ---" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Crédit Initial (TND)</label>
            <input required type="number" step="0.001" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none text-rose-500 font-black text-2xl" value={newCustomer.creditBalance} onChange={e => setNewCustomer({...newCustomer, creditBalance: parseFloat(e.target.value)})} />
          </div>
          <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 mt-4">
            VALIDER LA CRÉATION
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
