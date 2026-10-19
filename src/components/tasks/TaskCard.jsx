import React from 'react';
import Badge from '../common/Badge';
import { useTasks } from '../../context/TaskContext';
import { formatDate, getDueStatus } from '../../utils/dateUtils';
import { Calendar, AlertCircle, Edit3, Trash2, Check, Clock } from 'lucide-react';

export default function TaskCard({ task, layout = 'list' }) {
  const { toggleTaskComplete, openEditModal, requestDelete } = useTasks();
  const isCompleted = task.status === 'completed';
  const dueStatus = getDueStatus(task.dueDate, isCompleted);

  // Determine due date badge styling
  const getDueBadge = () => {
    if (!task.dueDate) return null;

    if (dueStatus === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Overdue ({formatDate(task.dueDate)})
        </span>
      );
    }

    if (dueStatus === 'today') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          Due Today
        </span>
      );
    }

    if (dueStatus === 'tomorrow') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40">
          <Calendar className="w-3 h-3 text-sky-500" />
          Tomorrow
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <Calendar className="w-3 h-3 text-slate-400" />
        {formatDate(task.dueDate)}
      </span>
    );
  };

  // List layout
  if (layout === 'list') {
    return (
      <div
        className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 ${
          isCompleted
            ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
            : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Left: Checkbox + Title & Description */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={() => toggleTaskComplete(task.id)}
            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 border ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-slate-800'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-sm font-medium leading-snug transition-all ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {task.title}
              </h4>
              {task.category && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {task.category}
                </span>
              )}
            </div>

            {task.description && (
              <p
                className={`text-xs mt-1 line-clamp-1 ${
                  isCompleted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Badges + Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:flex-nowrap pl-8 sm:pl-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={task.priority} withDot size="sm">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>

            <Badge variant={task.status} size="sm">
              {task.status === 'in_progress'
                ? 'In Progress'
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>

            {getDueBadge()}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => openEditModal(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => requestDelete(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid / Board Card layout
  return (
    <div
      className={`group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-150 ${
        isCompleted
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40 opacity-80'
          : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top: Category & Priority */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {task.category || 'General'}
          </span>
          <Badge variant={task.priority} withDot size="sm">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>

        {/* Checkbox & Title */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => toggleTaskComplete(task.id)}
            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 border ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-slate-800'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
          <h4
            className={`text-sm font-semibold leading-snug transition-all ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h4>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={`text-xs mt-2 line-clamp-3 leading-relaxed pl-8 ${
              isCompleted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer: Due date + status + actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {getDueBadge()}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => requestDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

