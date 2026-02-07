
import React, { useState, useEffect } from 'react';
import { ShoppingCart, WifiOff, CloudSync } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import HistoryList from './components/History';
import Settings from './components/Settings';
import Expenses from './components/Expenses';
import { 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMERS, 
  MOCK_SUPPLIERS, 
  APP_USERS 
} from './constants';
import { Product, Customer, Sale, User, Supplier, StoreSettings, Expense } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tf_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('tf_customers');
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });
  
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('tf_sales');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('tf_settings');
    return saved ? JSON.parse(saved) : {
      name: 'TUNISIA FOOD ALIMENTATION',
      address: 'Avenue Habib Bourguiba, Tunis 1001',
      phone: '+216 71 222 333',
      matriculeFiscal: '1678945/B/M/000',
      taxStampEnabled: true,
      taxStampAmount: 1.000,
      loyaltyEnabled: true,
      loyaltyRate: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('tf_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineSales();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tf_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('tf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tf_customers', JSON.stringify(customers));
  }, [customers]);

  const syncOfflineSales = () => {
    const offlineSales = sales.filter(s => !s.isSynced);
    if (offlineSales.length === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setSales(prev => prev.map(s => ({ ...s, isSynced: true })));
      setIsSyncing(false);
    }, 2000);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab(user.role === 'ADMIN' ? 'dashboard' : 'pos');
    // Auto-collapse sidebar if user is cashier to maximize POS
    if (user.role === 'CASHIER') setSidebarCollapsed(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleCompleteSale = (sale: Sale) => {
    const pointsEarned = storeSettings.loyaltyEnabled ? Math.floor(sale.total * storeSettings.loyaltyRate) : 0;
    const saleWithPoints = { ...sale, isSynced: isOnline, pointsEarned };
    
    setSales(prev => [...prev, saleWithPoints]);
    setProducts(prevProducts => prevProducts.map(p => {
      const soldItem = sale.items.find(item => item.id === p.id);
      if (soldItem) return { ...p, stockQuantity: p.stockQuantity - soldItem.quantity };
      return p;
    }));

    if (sale.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === sale.customerId) {
          return { 
            ...c, 
            creditBalance: sale.paymentMethod === 'CREDIT' ? c.creditBalance + sale.total : c.creditBalance,
            loyaltyPoints: storeSettings.loyaltyEnabled ? (c.loyaltyPoints || 0) + pointsEarned : c.loyaltyPoints
          };
        }
        return c;
      }));
    }
  };

  const handleAddProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const handleUpdateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const handleAddCustomer = (c: Customer) => setCustomers(prev => [c, ...prev]);
  const handleAddSupplier = (s: Supplier) => setSuppliers(prev => [s, ...prev]);
  const handleAddExpense = (e: Expense) => setExpenses(prev => [e, ...prev]);

  const alertsCount = products.filter(p => p.stockQuantity <= p.minStock).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#e0e7ff,_transparent_50%),radial-gradient(circle_at_bottom_left,_#fef2f2,_transparent_50%)]">
        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] shadow-2xl p-12 w-full max-w-md border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="h-32 w-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
          </div>
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl shadow-xl shadow-indigo-200 mb-8 transform hover:rotate-12 transition-transform duration-500">
              <ShoppingCart className="text-white h-10 w-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter uppercase">TunisiaFood</h1>
            <p className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">Business Intelligence ERP</p>
          </div>
          <div className="space-y-4 relative z-10">
            {APP_USERS.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="w-full flex items-center justify-between p-5 bg-white border-2 border-slate-50 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all group active:scale-[0.98] rounded-[28px]"
              >
                <div className="flex items-center">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl mr-5 transition-all shadow-sm ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-emerald-50 text-white'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{user.name}</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-indigo-500' : 'text-emerald-500'}`}>{user.role}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      currentUser={currentUser!} 
      onLogout={handleLogout}
      alertsCount={alertsCount}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      noPadding={activeTab === 'pos'}
    >
      {isSyncing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-indigo-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <CloudSync className="h-5 w-5 animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest">Synchronisation des ventes...</span>
        </div>
      )}

      {activeTab === 'dashboard' && <Dashboard products={products} sales={sales} />}
      {activeTab === 'pos' && <POS products={products} customers={customers} onCompleteSale={handleCompleteSale} currentUser={currentUser} settings={storeSettings} />}
      {activeTab === 'history' && <HistoryList sales={sales} />}
      {activeTab === 'inventory' && <Inventory products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} storeSettings={storeSettings} />}
      {activeTab === 'customers' && <Customers customers={customers} onAddCustomer={handleAddCustomer} loyaltyEnabled={storeSettings.loyaltyEnabled} />}
      {activeTab === 'suppliers' && <Suppliers suppliers={suppliers} onAddSupplier={handleAddSupplier} />}
      {activeTab === 'expenses' && <Expenses expenses={expenses} onAddExpense={handleAddExpense} />}
      {activeTab === 'settings' && <Settings settings={storeSettings} onSave={setStoreSettings} />}
    </Layout>
  );
};

export default App;
