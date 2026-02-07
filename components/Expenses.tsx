
import React, { useState } from 'react';
import { Wallet, Plus, Search, Filter, Calendar, Tag, DollarSign, Trash2 } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils';
import Modal from './Modal';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (e: Expense) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  RENT: 'Loyer',
  UTILITIES: 'STEG / SONEDE',
  SALARY: 'Salaires',
  OTHER: 'Autres'
};

const CATEGORY_COLORS: Record<string, string> = {
  RENT: 'bg-purple-100 text-purple-600 border-purple-200',
  UTILITIES: 'bg-blue-100 text-blue-600 border-blue-200',
  SALARY: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  OTHER: 'bg-slate-100 text-slate-500 border-slate-200'
};

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    label: '',
    amount: 0,
    category: 'OTHER',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredExpenses = expenses.filter(e => filter === 'ALL' || e.category === filter);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      ...newExpense as Expense,
      id: 'exp-' + Math.random().toString(36).substr(2, 9),
    };
    onAddExpense(expense);
    setIsModalOpen(false);
    setNewExpense({
      label: '',
      amount: 0,
      category: 'OTHER',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8 no-print">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center space-x-6">
          <div className="bg-rose-100 p-5 rounded-3xl shadow-lg shadow-rose-100">
            <Wallet className="h-8 w-8 text-rose-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Charges</p>
            <p className="text-3xl font-black text-slate-800">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-[40px] shadow-xl shadow-rose-200 flex items-center justify-between text-white">
          <div className="pl-4">
            <h3 className="font-black text-2xl uppercase tracking-tighter mb-1">Registre des Frais</h3>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Gardez un œil sur vos dépenses d'exploitation</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-5 bg-white text-rose-600 rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
          >
            + Enregistrer Frais
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {['ALL', 'RENT', 'UTILITIES', 'SALARY', 'OTHER'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)} 
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat === 'ALL' ? 'Toutes' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic pr-4">
          {filteredExpenses.length} Opérations enregistrées
        </span>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Catégorie</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Montant</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-32 text-center">
                  <div className="opacity-10 flex flex-col items-center">
                    <Wallet className="h-20 w-20 mb-4" />
                    <p className="font-black uppercase tracking-widest text-lg">Aucun frais ce mois-ci</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-5 text-xs font-bold text-slate-400">{expense.date}</td>
                  <td className="px-10 py-5">
                    <p className="text-sm font-bold text-slate-800 uppercase">{expense.label}</p>
                  </td>
                  <td className="px-10 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${CATEGORY_COLORS[expense.category]}`}>
                      {CATEGORY_LABELS[expense.category]}
                    </span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <p className="text-sm font-black text-rose-500">-{formatCurrency(expense.amount)}</p>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Frais">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Description</label>
            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-rose-400 text-slate-800 font-bold uppercase" placeholder="Objet de la dépense" value={newExpense.label} onChange={e => setNewExpense({...newExpense, label: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Montant (TND)</label>
              <input required type="number" step="0.001" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-rose-400 text-rose-500 font-black text-2xl" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Date</label>
              <input required type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-rose-400 text-slate-800 font-bold" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Catégorie</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewExpense({...newExpense, category: key as any})}
                  className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    newExpense.category === key 
                      ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:bg-black mt-4">
            Enregistrer la Dépense
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
