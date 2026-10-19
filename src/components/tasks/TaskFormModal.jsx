import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Input, Textarea } from '../common/Input';
import { useTasks } from '../../context/TaskContext';
import { getTodayDateString } from '../../utils/dateUtils';
import { Flag, CheckCircle2, Tag, Calendar } from 'lucide-react';

const COMMON_CATEGORIES = ['Engineering', 'Design', 'Planning', 'Analytics', 'Personal', 'Strategy'];

export default function TaskFormModal() {
  const { isTaskModalOpen, editingTask, closeTaskModal, addTask, updateTask } = useTasks();

  const isEditing = Boolean(editingTask && editingTask.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [titleError, setTitleError] = useState('');

  // Sync state whenever editingTask changes or modal opens
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'pending');
      setDueDate(editingTask.dueDate || '');
      setCategory(editingTask.category || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setDueDate(getTodayDateString());
      setCategory('General');
    }
    setTitleError('');
  }, [editingTask, isTaskModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }

    const taskPayload = {
      title,
      description,
      priority,
      status,
      dueDate,
      category: category.trim() || 'General',
    };

    if (isEditing) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update task details, schedule, or priority level.'
          : 'Add a new task to organize your workflow and track progress.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="e.g. Conduct design system token review"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          error={titleError}
          required
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Description (Optional)"
          placeholder="Add context, acceptance criteria, or relevant links..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        {/* Priority & Status Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-500" />
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low', color: 'border-sky-300 text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300' },
                { id: 'medium', label: 'Medium', color: 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
                { id: 'high', label: 'High', color: 'border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-all text-center ${
                    priority === opt.id
                      ? `${opt.color} ring-2 ring-brand-500 font-semibold shadow-sm`
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Category / Tag
            </label>
            <input
              type="text"
              placeholder="e.g. Planning, Design, Personal"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Quick Category Chips */}
        <div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mb-1">
            Quick suggestions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-300'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={closeTaskModal}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

