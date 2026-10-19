import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { isToday, isOverdue } from '../utils/dateUtils';
import { SunMedium, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TodayView() {
  const { tasks, openCreateModal } = useTasks();

  const todayTasks = tasks.filter(t => isToday(t.dueDate));
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status === 'completed'));
  const completedToday = todayTasks.filter(t => t.status === 'completed');
  const pendingToday = todayTasks.filter(t => t.status !== 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <SunMedium className="w-6 h-6 text-amber-500" />
            Today's Schedule
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold">
              {pendingToday.length} remaining
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Focus on what matters most today. Complete these tasks before the day ends.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openCreateModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task for Today
        </Button>
      </div>

      {/* Overdue Section (if any) */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Overdue Tasks ({overdueTasks.length})
          </div>
          <div className="space-y-2">
            {overdueTasks.map(task => (
              <TaskCard key={task.id} task={task} layout="list" />
            ))}
          </div>
        </div>
      )}

      {/* Today Tasks Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Due Today ({todayTasks.length})
        </h3>

        {todayTasks.length === 0 ? (
          <EmptyState
            icon={SunMedium}
            title="No tasks scheduled for today"
            description="You don't have any tasks due today. Add one now or enjoy your accomplishments!"
            actionLabel="Schedule Task"
            onAction={() => openCreateModal()}
          />
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} layout="list" />
            ))}
          </div>
        )}
      </div>

      {/* Finished Today Summary */}
      {completedToday.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200/60 dark:border-emerald-900/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Great job! You have already completed {completedToday.length} {completedToday.length === 1 ? 'task' : 'tasks'} today.
          </span>
        </div>
      )}
    </div>
  );
}
