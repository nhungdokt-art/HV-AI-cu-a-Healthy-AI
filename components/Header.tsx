import React from 'react';
import { HeartPulse } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-primary-500 to-primary-600 text-white p-2 rounded-xl shadow-lg shadow-primary-500/30">
            <HeartPulse size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">HV AI</h1>
            <p className="text-xs text-primary-600 font-medium">Trợ lý Sức khỏe & Đời sống</p>
          </div>
        </div>
        <div className="hidden sm:block">
           <span className="text-xs font-semibold bg-primary-100 text-primary-800 px-3 py-1 rounded-full border border-primary-200">
             Beta v1.0
           </span>
        </div>
      </div>
    </header>
  );
};
