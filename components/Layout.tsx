
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  History, 
  Wallet,
  Settings,
  LogOut, 
  User as UserIcon,
  BookOpen,
  Bell,
  Menu,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  alertsCount?: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, currentUser, onLogout, 
  alertsCount = 0, sidebarCollapsed, setSidebarCollapsed, noPadding 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'pos', label: 'Vente (POS)', icon: ShoppingCart, roles: ['ADMIN', 'CASHIER'] },
    { id: 'history', label: 'Historique', icon: History, roles: ['ADMIN', 'CASHIER'] },
    { id: 'inventory', label: 'Stock & Produits', icon: Package, roles: ['ADMIN'] },
    { id: 'customers', label: 'Clients (Carnet)', icon: BookOpen, roles: ['ADMIN', 'CASHIER'] },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck, roles: ['ADMIN'] },
    { id: 'expenses', label: 'Dépenses', icon: Wallet, roles: ['ADMIN'] },
    { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      {/* Sidebar - Collapsible to 0 for Focus Mode */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col no-print shadow-2xl z-50 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'w-0' : 'w-72'}`}>
        <div className={`p-6 flex items-center overflow-hidden whitespace-nowrap ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 shrink-0">
            <ShoppingCart className="text-white h-6 w-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="ml-4 animate-in fade-in duration-500">
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">TunisiaFood</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-1">Business Suite</p>
            </div>
          )}
        </div>

        <nav className={`flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar mt-4 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3.5 text-sm font-bold rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon className={`h-5 w-5 shrink-0 mr-3 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t border-slate-100 bg-slate-50/50 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <div className="flex items-center p-3 mb-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 ml-3">
              <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Floating Menu Trigger for Focus Mode */}
        {sidebarCollapsed && (
          <button 
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-6 top-4 z-[60] p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-2xl animate-in fade-in zoom-in no-print"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        <header className={`h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40 no-print shrink-0 ${sidebarCollapsed ? 'pl-24' : ''} transition-all duration-500`}>
          <div className="flex items-center gap-6">
             {!sidebarCollapsed && (
               <button 
                onClick={() => setSidebarCollapsed(true)}
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                title="Masquer le menu (Mode Focus)"
               >
                <Menu className="h-5 w-5" />
               </button>
             )}
             <div className="flex flex-col">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">
                  {menuItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Sess. {currentUser.name}</p>
             </div>
          </div>
          
          <div className="flex items-center space-x-6">
             {activeTab === 'pos' && (
               <div className="hidden sm:flex items-center bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-widest animate-pulse">
                 Terminal Vente Ouvert
               </div>
             )}
             <div className="flex items-center gap-4">
                <button 
                   onClick={() => setActiveTab('inventory')}
                   className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all"
                >
                   <Bell className="h-5 w-5" />
                   {alertsCount > 0 && (
                     <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                       {alertsCount}
                     </span>
                   )}
                </button>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                   <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Connecté</span>
                </div>
             </div>
          </div>
        </header>

        <main className={`flex-1 overflow-auto custom-scrollbar ${noPadding ? '' : 'p-8 max-w-[1600px] mx-auto w-full'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
