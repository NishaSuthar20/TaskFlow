import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { getDueStatus } from '../utils/dateUtils';
import { CalendarDays, Plus } from 'lucide-react';

export default function UpcomingView() {
  const { tasks, openCreateModal } = useTasks();

  // Upcoming: tasks due tomorrow or later, sorted chronologically
  const upcomingTasks = tasks
    .filter(t => {
      if (t.status === 'completed') return false;
      const status = getDueStatus(t.dueDate, false);
      return status === 'tomorrow' || status === 'upcoming';
    })
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Upcoming Deadlines
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {upcomingTasks.length} {upcomingTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plan ahead and anticipate tasks scheduled for the coming days and weeks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openCreateModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule Task
        </Button>
      </div>

      {upcomingTasks.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming tasks scheduled"
          description="You don't have any future tasks queued up. Create a task with a future due date to plan your schedule."
          actionLabel="Add Upcoming Task"
          onAction={() => openCreateModal()}
        />
      ) : (
        <div className="space-y-2.5">
          {upcomingTasks.map((task) => (
            <TaskCard key={task.id} task={task} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
