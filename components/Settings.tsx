
import React from 'react';
import { Save, Building, MapPin, Phone, Hash, ReceiptText, Star, Settings as SettingsIcon } from 'lucide-react';
import { StoreSettings } from '../types';

interface SettingsProps {
  settings: StoreSettings;
  onSave: (s: StoreSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = React.useState(settings);

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
        <div className="flex items-center space-x-4 border-b pb-8 border-slate-100">
           <div className="bg-black p-4 rounded-2xl shadow-lg">
              <Building className="text-white h-7 w-7" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tight">Identité du Magasin</h3>
              <p className="text-xs text-black font-black uppercase opacity-40">Informations affichées sur les tickets</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Nom de l'enseigne</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white outline-none font-black text-black uppercase text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Matricule Fiscal</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white outline-none font-black text-black text-sm"
                value={formData.matriculeFiscal}
                onChange={e => setFormData({...formData, matriculeFiscal: e.target.value})}
              />
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Adresse complète</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white outline-none font-black text-black text-sm uppercase"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Contact Téléphonique</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <input 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white outline-none font-black text-black"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fiscality & Tax Stamp */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b pb-8 border-slate-100">
           <div className="flex items-center space-x-4">
              <div className="bg-black p-4 rounded-2xl">
                <ReceiptText className="text-white h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Fiscalité & Timbre</h3>
                <p className="text-xs text-black font-black uppercase opacity-40">Configuration des taxes locales</p>
              </div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.taxStampEnabled}
                onChange={e => setFormData({...formData, taxStampEnabled: e.target.checked})}
              />
              <div className="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-black"></div>
           </label>
        </div>

        {formData.taxStampEnabled && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-black uppercase tracking-widest">Montant du Timbre (TND)</label>
            <input 
              type="number" step="0.100"
              className="w-48 p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white outline-none font-black text-black text-xl"
              value={formData.taxStampAmount}
              onChange={e => setFormData({...formData, taxStampAmount: parseFloat(e.target.value)})}
            />
          </div>
        )}
      </div>

      {/* NEW: Loyalty Program Section */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b pb-8 border-slate-100">
           <div className="flex items-center space-x-4">
              <div className="bg-amber-500 p-4 rounded-2xl shadow-lg shadow-amber-100">
                <Star className="text-white h-7 w-7 fill-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Programme Fidélité</h3>
                <p className="text-xs text-black font-black uppercase opacity-40">Gérez les points clients</p>
              </div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.loyaltyEnabled}
                onChange={e => setFormData({...formData, loyaltyEnabled: e.target.checked})}
              />
              <div className="w-16 h-9 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-amber-500"></div>
           </label>
        </div>

        {formData.loyaltyEnabled && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
               <div className="flex items-center space-x-3 mb-2">
                  <SettingsIcon className="h-4 w-4 text-amber-600" />
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Règle de conversion</p>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-700 mb-2">Pour chaque 1.000 TND dépensé, le client gagne :</p>
                    <div className="flex items-center space-x-3">
                       <input 
                         type="number" 
                         min="0.1" 
                         step="0.1"
                         className="w-24 p-4 bg-white border-2 border-amber-200 rounded-2xl outline-none font-black text-amber-600 text-xl text-center"
                         value={formData.loyaltyRate}
                         onChange={e => setFormData({...formData, loyaltyRate: parseFloat(e.target.value)})}
                       />
                       <span className="font-black text-amber-800 uppercase text-xs tracking-widest">Points</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 sticky bottom-8">
        <button 
          onClick={() => onSave(formData)}
          className="flex items-center px-10 py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-2xl active:scale-95"
        >
          <Save className="h-5 w-5 mr-3" />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default Settings;
