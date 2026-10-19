import React from 'react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { History, Activity } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card text-center">
        <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400 dark:text-slate-500">
          No recent activity logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <History className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {activities.slice(0, 8).map((act) => (
          <div key={act.id} className="flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <p className="text-slate-700 dark:text-slate-300 truncate">
                {act.description}
              </p>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
              {formatTimeAgo(act.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

