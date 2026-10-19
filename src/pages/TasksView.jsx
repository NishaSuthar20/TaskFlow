import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { filterAndSortTasks } from '../utils/filterUtils';
import { Plus, CheckSquare, SearchX } from 'lucide-react';

export default function TasksView() {
  const {
    tasks,
    searchQuery,
    filterStatus,
    filterPriority,
    filterCategory,
    sortBy,
    sortOrder,
    viewMode,
    openCreateModal,
    resetFilters,
  } = useTasks();

  const filteredTasks = filterAndSortTasks(tasks, {
    searchQuery,
    filterStatus,
    filterPriority,
    filterCategory,
    sortBy,
    sortOrder,
  });

  const isFiltered =
    searchQuery.trim() !== '' ||
    filterStatus !== 'all' ||
    filterPriority !== 'all' ||
    filterCategory !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            My Tasks
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, filter, and organize all tasks across your active projects.
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

      {/* Filter & Sorting Controls */}
      <TaskFilterBar showViewToggle={true} />

      {/* Task Content */}
      {filteredTasks.length === 0 ? (
        isFiltered ? (
          <EmptyState
            icon={SearchX}
            title="No matching tasks found"
            description="No tasks match your current search criteria or active filter combination."
            actionLabel="Reset All Filters"
            onAction={resetFilters}
          />
        ) : (
          <EmptyState
            icon={CheckSquare}
            title="Your task list is empty"
            description="Create your first task to start organizing your work and tracking deadlines."
            actionLabel="Create First Task"
            onAction={() => openCreateModal()}
          />
        )
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
