import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import Button from '../components/common/Button';
import { Flame, Plus } from 'lucide-react';

export default function PrioritiesView() {
  const { tasks, openCreateModal } = useTasks();

  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
  const mediumPriority = tasks.filter(t => t.priority === 'medium' && t.status !== 'completed');
  const lowPriority = tasks.filter(t => t.priority === 'low' && t.status !== 'completed');

  const sections = [
    {
      id: 'high',
      title: 'High Priority',
      description: 'Critical and urgent tasks requiring immediate focus',
      color: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      tasks: highPriority,
    },
    {
      id: 'medium',
      title: 'Medium Priority',
      description: 'Important tasks with standard scheduling',
      color: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      tasks: mediumPriority,
    },
    {
      id: 'low',
      title: 'Low Priority',
      description: 'Backlog items and minor updates to handle when time permits',
      color: 'border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
      tasks: lowPriority,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" />
            Task Priorities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual breakdown of all active tasks grouped by urgency level.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openCreateModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <div
            key={section.id}
            className={`flex flex-col rounded-2xl border p-4 sm:p-5 ${section.color}`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {section.description}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${section.badgeColor}`}>
                {section.tasks.length}
              </span>
            </div>

            {/* Task list for priority */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {section.tasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 rounded-xl bg-white/40 dark:bg-slate-900/30">
                  No active tasks in this priority tier.
                </div>
              ) : (
                section.tasks.map(task => (
                  <TaskCard key={task.id} task={task} layout="grid" />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
