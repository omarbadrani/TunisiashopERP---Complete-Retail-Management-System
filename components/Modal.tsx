
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
        <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-black text-black uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black hover:text-white rounded-xl transition-all border border-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
