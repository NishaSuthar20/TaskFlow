import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function CompletedView() {
  const { tasks, toggleTaskComplete } = useTasks();

  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            Completed Archive
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold">
              {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review finished tasks and reopen any item whenever necessary.
          </p>
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed tasks yet"
          description="Tasks marked as completed will appear here so you can track your productivity history."
        />
      ) : (
        <div className="space-y-2.5">
          {completedTasks.map((task) => (
            <TaskCard key={task.id} task={task} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
