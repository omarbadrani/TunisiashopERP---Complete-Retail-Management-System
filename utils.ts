
import { CURRENCY } from './constants';

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(3) + ' ' + CURRENCY;
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

export const isNearExpiry = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

export const isExpired = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const today = new Date();
  return expiry < today;
};
