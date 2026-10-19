import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isDanger = toast.type === 'danger';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slide-up transition-all">
      <div
        className={`flex items-center justify-between p-4 rounded-xl shadow-elevated border backdrop-blur-md ${
          isDanger
            ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
            : isInfo
            ? 'bg-sky-50/95 dark:bg-sky-950/90 border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-100'
            : 'bg-slate-900/95 dark:bg-slate-800/95 border-slate-700/50 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDanger ? (
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-lg text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

