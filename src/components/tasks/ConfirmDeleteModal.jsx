import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useTasks } from '../../context/TaskContext';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal() {
  const { taskToDelete, cancelDelete, confirmDelete } = useTasks();

  if (!taskToDelete) return null;

  return (
    <Modal
      isOpen={Boolean(taskToDelete)}
      onClose={cancelDelete}
      title="Delete Task"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            Are you sure you want to delete <strong className="font-semibold">"{taskToDelete.title}"</strong>? This action cannot be undone.
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}

