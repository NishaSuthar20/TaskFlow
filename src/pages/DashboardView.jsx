import React from 'react';
import { useTasks } from '../context/TaskContext';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { isToday, isOverdue, getProductivityGreeting } from '../utils/dateUtils';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  TrendingUp,
  Plus,
  ArrowRight,
  SunMedium,
  Flame,
} from 'lucide-react';

export default function DashboardView() {
  const { tasks, metrics, activityLog, openCreateModal, setActiveView } = useTasks();

  const todayTasks = tasks.filter(t => isToday(t.dueDate) && t.status !== 'completed');
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status === 'completed'));
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {getProductivityGreeting()}, Alex
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what is happening across your projects today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => openCreateModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Tasks"
          value={metrics.total}
          subtitle={`${metrics.pending + metrics.inProgress} active remaining`}
          icon={ListTodo}
          variant="brand"
          onClick={() => setActiveView('tasks')}
        />

        <StatCard
          title="Completed"
          value={metrics.completed}
          subtitle={`${metrics.completionRate}% completion rate`}
          icon={CheckCircle2}
          variant="emerald"
          onClick={() => setActiveView('completed')}
        />

        <StatCard
          title="Due Today"
          value={metrics.dueToday}
          subtitle={metrics.dueToday === 0 ? 'All caught up' : 'Needs attention today'}
          icon={Clock}
          variant="amber"
          onClick={() => setActiveView('today')}
        />

        <StatCard
          title="Overdue"
          value={metrics.overdue}
          subtitle={metrics.overdue === 0 ? 'No overdue tasks' : 'Past scheduled deadline'}
          icon={AlertCircle}
          variant="rose"
          onClick={() => setActiveView('tasks')}
        />
      </div>

      {/* Progress Bar Banner */}
      {metrics.total > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Overall Task Progress
            </span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">
              {metrics.completionRate}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>{metrics.completed} finished</span>
            <span>{metrics.pending + metrics.inProgress} in flight</span>
          </div>
        </div>
      )}

      {/* Overdue Warning Callout (if any overdue) */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                You have {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}!
              </p>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                Update due dates or complete them to keep your schedule accurate.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('tasks')}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 dark:text-rose-300 flex items-center gap-1 flex-shrink-0"
          >
            Review <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Dashboard Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Due Today & High Priority Focus (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Due Today */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-amber-500" />
                Due Today ({todayTasks.length})
              </h3>
              <button
                type="button"
                onClick={() => setActiveView('today')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <EmptyState
                icon={SunMedium}
                title="All clear for today"
                description="You don't have any tasks scheduled for today. Enjoy your day or plan ahead!"
                actionLabel="Schedule Task for Today"
                onAction={() => openCreateModal()}
              />
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => (
                  <TaskCard key={task.id} task={task} layout="list" />
                ))}
              </div>
            )}
          </div>

          {/* Section: High Priority Watchlist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                High-Priority Focus ({highPriorityTasks.length})
              </h3>
              <button
                type="button"
                onClick={() => setActiveView('priorities')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                View priorities <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {highPriorityTasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  No urgent or high-priority items pending right now.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {highPriorityTasks.slice(0, 3).map(task => (
                  <TaskCard key={task.id} task={task} layout="list" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Feed & Shortcuts */}
        <div className="space-y-6">
          <ActivityFeed activities={activityLog} />

          {/* Quick Shortcuts Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Quick Views
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveView('upcoming')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">Upcoming deadlines</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveView('completed')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">Finished archive ({metrics.completed})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">Workspace data & theme</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
