
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  PackageX, 
  DollarSign,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell
} from 'recharts';
import { Product, Sale } from '../types';
import { formatCurrency } from '../utils';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dailySales = sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString());
  const revenue = dailySales.reduce((acc, s) => acc + s.total, 0);
  
  const lowStock = products.filter(p => p.stockQuantity <= p.minStock).length;
  const expired = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date()).length;

  const chartData = [
    { name: 'Lun', sales: 450 },
    { name: 'Mar', sales: 620 },
    { name: 'Mer', sales: 580 },
    { name: 'Jeu', sales: 750 },
    { name: 'Ven', sales: 900 },
    { name: 'Sam', sales: 1100 },
    { name: 'Dim', sales: 850 },
  ];

  const categoryData = [
    { name: 'Biscuits', value: 400, color: '#f59e0b' },
    { name: 'Boissons', value: 300, color: '#3b82f6' },
    { name: 'Frais', value: 200, color: '#10b981' },
    { name: 'Épicerie', value: 278, color: '#f97316' },
  ];

  const getAiInsights = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = {
        totalProducts: products.length,
        lowStockItems: products.filter(p => p.stockQuantity <= p.minStock).map(p => p.name),
        todaySalesCount: dailySales.length,
        todayRevenue: revenue,
        topProducts: sales.flatMap(s => s.items).slice(0, 10).map(i => i.name)
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `En tant qu'expert ERP pour une épicerie en Tunisie, analyse ces données et donne 3 conseils stratégiques TRÈS COURTS (max 15 mots chacun) : ${JSON.stringify(context)}. Réponds en français.`,
        config: {
          systemInstruction: "Tu es un consultant business expert en commerce de détail tunisien. Tu donnes des conseils brefs, percutants et actionnables.",
          temperature: 0.7,
        },
      });

      setAiAdvice(response.text || "Prêt à analyser vos données.");
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAdvice("Impossible de contacter l'assistant IA pour le moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    getAiInsights();
  }, []);

  return (
    <div className="space-y-8 no-print animate-in fade-in duration-500">
      {/* AI Strategy Panel */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-[48px] p-8 shadow-2xl relative overflow-hidden group border border-indigo-700/50">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles className="h-64 w-64 text-white rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
               <div className="bg-indigo-500/30 p-2 rounded-xl backdrop-blur-md">
                  <Lightbulb className="h-5 w-5 text-indigo-300" />
               </div>
               <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest">Assistant IA Stratégique</h3>
            </div>
            <div className="min-h-[60px]">
              {isAnalyzing ? (
                <div className="flex items-center space-x-3 animate-pulse">
                  <div className="h-4 w-4 bg-indigo-400 rounded-full"></div>
                  <p className="text-indigo-300 font-bold italic">Analyse de vos tendances en cours...</p>
                </div>
              ) : (
                <p className="text-white text-xl font-medium leading-relaxed max-w-2xl whitespace-pre-line">
                  {aiAdvice || "Cliquez sur rafraîchir pour obtenir une analyse de votre commerce."}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={getAiInsights}
            disabled={isAnalyzing}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 backdrop-blur-xl transition-all flex items-center space-x-2 font-black text-xs uppercase disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Rafraîchir l'analyse</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-blue-50 h-24 w-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg flex items-center">
              +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Ventes du jour</p>
          <p className="text-3xl font-black text-slate-800">{formatCurrency(revenue)}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-indigo-50 h-24 w-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg">BÉNÉFICE</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Profit estimé</p>
          <p className="text-3xl font-black text-slate-800">{formatCurrency(revenue * 0.22)}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-amber-50 h-24 w-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-100">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${lowStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
              {lowStock > 0 ? 'ACTION REQUISE' : 'OK'}
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Stock Critique</p>
          <p className="text-3xl font-black text-slate-800">{lowStock}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-rose-50 h-24 w-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-3 bg-rose-500 rounded-2xl shadow-lg shadow-rose-100">
              <PackageX className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">DLC Dépassées</p>
          <p className="text-3xl font-black text-slate-800">{expired}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Area Chart */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Évolution Hebdomadaire</h3>
            <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 text-xs font-black uppercase">Volume Ventes</div>
          </div>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Performance Rayons</h3>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl text-emerald-600 text-xs font-black uppercase">Top Catégories</div>
          </div>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
