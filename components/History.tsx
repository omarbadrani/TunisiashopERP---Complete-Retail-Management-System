
import React from 'react';
import { History as HistoryIcon, Search, Printer, RotateCcw, Calendar, CloudOff, CloudCheck, FileSpreadsheet, Download } from 'lucide-react';
import { Sale } from '../types';
import { formatCurrency } from '../utils';

interface HistoryProps {
  sales: Sale[];
}

const HistoryList: React.FC<HistoryProps> = ({ sales }) => {
  
  const exportToCSV = () => {
    if (sales.length === 0) return;
    
    // CSV Header
    const headers = ["Ticket ID", "Date", "Heure", "Total (TND)", "Mode Paiement", "Sync Status"];
    
    // CSV Content
    const rows = sales.map(sale => {
      const date = new Date(sale.timestamp);
      return [
        sale.id,
        date.toLocaleDateString('fr-TN'),
        date.toLocaleTimeString('fr-TN'),
        sale.total.toFixed(3),
        sale.paymentMethod,
        sale.isSynced ? "OUI" : "NON"
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Ventes_TunisiaFood_${new Date().toLocaleDateString('fr-TN')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par Ticket #..."
            className="w-full pl-14 pr-4 py-4 border-2 border-slate-50 bg-slate-50/50 rounded-2xl focus:bg-white focus:border-indigo-400 outline-none font-bold text-slate-700 transition-all"
          />
        </div>
        <div className="flex space-x-3">
           <button 
              onClick={exportToCSV}
              className="flex items-center px-8 py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl hover:bg-emerald-100 transition-all font-black text-xs uppercase tracking-widest shadow-sm"
           >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter Excel (CSV)
           </button>
           <button className="flex items-center px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest shadow-sm">
              <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
              Ce mois-ci
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">N° Ticket</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Articles</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sync</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-40 text-center">
                  <div className="flex flex-col items-center opacity-10">
                    <HistoryIcon className="h-20 w-20 mb-4" />
                    <p className="font-black uppercase tracking-widest text-lg">Aucune vente enregistrée</p>
                  </div>
                </td>
              </tr>
            ) : (
              sales.slice().reverse().map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-black text-sm text-slate-800 uppercase tracking-tighter">#{sale.id}</td>
                  <td className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase">
                    {new Date(sale.timestamp).toLocaleString('fr-TN')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-3">
                       {sale.items.slice(0, 3).map((item, idx) => (
                         <div key={idx} className="h-10 w-10 rounded-xl bg-indigo-50 border-2 border-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm">
                           {item.name.charAt(0)}
                         </div>
                       ))}
                       {sale.items.length > 3 && (
                         <div className="h-10 w-10 rounded-xl bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm">
                           +{sale.items.length - 3}
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-indigo-600 text-center text-lg">{formatCurrency(sale.total)}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {sale.isSynced ? (
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg" title="Synchronisé">
                           <CloudCheck className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-amber-50 text-amber-500 rounded-lg animate-pulse" title="En attente de connexion">
                           <CloudOff className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100 shadow-sm" title="Réimprimer">
                        <Printer className="h-4 w-4" />
                      </button>
                      <button className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-100 shadow-sm" title="Annuler Vente">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
