import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
  onClick,
}) {
  const variantStyles = {
    brand: {
      bg: 'bg-brand-50/70 dark:bg-brand-950/40',
      text: 'text-brand-600 dark:text-brand-400',
      border: 'hover:border-brand-300 dark:hover:border-brand-800',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-800',
    },
    rose: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-300 dark:hover:border-rose-800',
    },
    sky: {
      bg: 'bg-sky-50/70 dark:bg-sky-950/40',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'hover:border-sky-300 dark:hover:border-sky-800',
    },
  };

  const style = variantStyles[variant] || variantStyles.brand;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 ' + style.border : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}

