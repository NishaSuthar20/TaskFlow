import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { taskStorage } from '../services/taskStorage';
import { isToday, isOverdue } from '../utils/dateUtils';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  // Task data & Activity
  const [tasks, setTasks] = useState(() => taskStorage.getTasks());
  const [activityLog, setActivityLog] = useState(() => taskStorage.getActivity());

  // Navigation View ('dashboard' | 'tasks' | 'today' | 'upcoming' | 'completed' | 'priorities' | 'settings')
  const [activeView, setActiveView] = useState('dashboard');

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'created' | 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Modal Dialogs state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Save changes to localStorage whenever tasks change
  useEffect(() => {
    taskStorage.saveTasks(tasks);
  }, [tasks]);

  // Toast auto-dismiss timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const addActivity = (description) => {
    const updated = taskStorage.logActivity(description);
    setActivityLog(updated);
  };

  // CRUD Operations
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'pending',
      dueDate: taskData.dueDate || '',
      category: taskData.category ? taskData.category.trim() : 'General',
      createdAt: Date.now(),
      completedAt: taskData.status === 'completed' ? Date.now() : null,
    };

    setTasks(prev => [newTask, ...prev]);
    addActivity(`Created task "${newTask.title}"`);
    showToast(`Task "${newTask.title}" created successfully`);
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const updateTask = (id, updatedFields) => {
    let taskTitle = '';
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          taskTitle = updatedFields.title || task.title;
          const isNowCompleted = updatedFields.status === 'completed';
          const wasCompleted = task.status === 'completed';

          return {
            ...task,
            ...updatedFields,
            title: updatedFields.title !== undefined ? updatedFields.title.trim() : task.title,
            description: updatedFields.description !== undefined ? updatedFields.description.trim() : task.description,
            completedAt: isNowCompleted && !wasCompleted ? Date.now() : !isNowCompleted ? null : task.completedAt,
          };
        }
        return task;
      })
    );

    addActivity(`Updated task "${taskTitle}"`);
    showToast('Task updated successfully');
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (target) {
      addActivity(`Deleted task "${target.title}"`);
      showToast(`Deleted "${target.title}"`, 'danger');
    }
    setTaskToDelete(null);
  };

  const toggleTaskComplete = (id) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const isCurrentlyCompleted = task.status === 'completed';
          const newStatus = isCurrentlyCompleted ? 'pending' : 'completed';
          const newCompletedAt = isCurrentlyCompleted ? null : Date.now();

          addActivity(
            isCurrentlyCompleted
              ? `Reopened task "${task.title}"`
              : `Completed task "${task.title}"`
          );
          showToast(
            isCurrentlyCompleted ? 'Task reopened' : 'Task marked as completed!'
          );

          return {
            ...task,
            status: newStatus,
            completedAt: newCompletedAt,
          };
        }
        return task;
      })
    );
  };

  // Modal Triggers
  const openCreateModal = (defaultCategory = '') => {
    setEditingTask(defaultCategory ? { category: defaultCategory } : null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const requestDelete = (task) => {
    setTaskToDelete(task);
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
    }
  };

  // Filter & Search Controls
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setSortBy('dueDate');
    setSortOrder('asc');
  };

  // Data Management in Settings
  const reloadSampleData = () => {
    const samples = taskStorage.resetToSample();
    setTasks(samples);
    setActivityLog(taskStorage.getActivity());
    showToast('Sample tasks restored');
  };

  const clearAllTasks = () => {
    const empty = taskStorage.clearAll();
    setTasks(empty);
    setActivityLog(taskStorage.getActivity());
    showToast('All tasks cleared', 'danger');
  };

  const importBackup = (jsonString) => {
    try {
      const imported = taskStorage.importBackup(jsonString);
      setTasks(imported);
      setActivityLog(taskStorage.getActivity());
      showToast(`Successfully imported ${imported.length} tasks`);
    } catch {
      showToast('Failed to import backup file. Check file format.', 'danger');
    }
  };

  // Derived Real-time Analytics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status === 'completed')).length;
    const dueToday = tasks.filter(t => isToday(t.dueDate) && t.status !== 'completed').length;
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      dueToday,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  // Unique Categories
  const categories = useMemo(() => {
    const set = new Set();
    tasks.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [tasks]);

  const value = {
    tasks,
    activityLog,
    metrics,
    categories,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    isTaskModalOpen,
    editingTask,
    taskToDelete,
    toast,
    setToast,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    openCreateModal,
    openEditModal,
    closeTaskModal,
    requestDelete,
    cancelDelete,
    confirmDelete,
    resetFilters,
    reloadSampleData,
    clearAllTasks,
    importBackup,
    showToast,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

