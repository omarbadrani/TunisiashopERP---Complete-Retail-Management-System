
export type UserRole = 'ADMIN' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  matriculeFiscal: string;
  taxStampEnabled: boolean;
  taxStampAmount: number;
  loyaltyEnabled: boolean; // New: Master switch for loyalty
  loyaltyRate: number;    // New: Points per TND (e.g., 1)
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  discountPercentage?: number;
  tva: number; 
  stockQuantity: number;
  minStock: number;
  expiryDate?: string; 
  imageUrl?: string;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: 'RENT' | 'UTILITIES' | 'SALARY' | 'OTHER';
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  taxAmount: number;
  taxStamp: number;
  paymentMethod: 'CASH' | 'CARD' | 'CHECK' | 'CREDIT';
  customerId?: string;
  cashierId: string;
  isSynced?: boolean;
  pointsEarned?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditBalance: number;
  loyaltyPoints: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  debt: number;
}
