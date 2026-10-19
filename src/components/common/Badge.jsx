import React from 'react';

/**
 * Reusable Design System Badge
 * 
 * Supports predefined semantics for TaskFlow:
 * - Priority: 'high' (Rose), 'medium' (Amber), 'low' (Sky/Slate)
 * - Status: 'completed' (Emerald), 'in_progress' (Brand/Violet), 'pending' (Slate)
 * - Generic color: 'brand' | 'slate' | 'emerald' | 'amber' | 'rose' | 'sky'
 */
export default function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  withDot = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const variantStyles = {
    // Priorities
    high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
    low: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60',
    
    // Statuses
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
    in_progress: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900/60',
    pending: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    
    // Direct colors
    brand: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900/60',
    slate: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60',
    sky: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60',
  };

  const dotColors = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-sky-500',
    completed: 'bg-emerald-500',
    in_progress: 'bg-brand-500',
    pending: 'bg-slate-400',
    brand: 'bg-brand-500',
    slate: 'bg-slate-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.slate;
  const selectedDotColor = dotColors[variant] || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${sizeStyles[size]} ${selectedVariant} ${className}`}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedDotColor}`} />
      )}
      {children}
    </span>
  );
}

