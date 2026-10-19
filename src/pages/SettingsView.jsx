import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  Settings,
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { taskStorage } from '../services/taskStorage';

export default function SettingsView() {
  const { reloadSampleData, clearAllTasks, importBackup, showToast } = useTasks();
  const { theme, toggleTheme, isDark } = useTheme();

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);

  // Handle Export Download
  const handleExportDownload = () => {
    const jsonString = taskStorage.exportBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup file downloaded');
  };

  // Handle Copy JSON
  const handleCopyJSON = () => {
    const jsonString = taskStorage.exportBackup();
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopiedExport(true);
      showToast('Backup JSON copied to clipboard');
      setTimeout(() => setCopiedExport(false), 2000);
    });
  };

  // Handle Import Submit
  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    try {
      importBackup(importJsonText);
      setIsImportModalOpen(false);
      setImportJsonText('');
    } catch {
      // Toast already shown in context
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your interface theme, manage task persistence, and export data backups.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Appearance & Theme
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Color Theme
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current active theme is <strong>{isDark ? 'Dark Mode' : 'Light Mode'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                !isDark
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              Light
            </button>
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'border-brand-500 bg-brand-950/60 text-brand-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4 text-brand-400" />
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Data Storage & Backup
          </h3>
        </div>

        {/* Export / Import */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Export Task Backup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your tasks and activity log as a JSON file or copy to clipboard for safe keeping.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handleExportDownload}>
                Download .json
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopyJSON}>
                {copiedExport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : 'Copy JSON'}
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Import Task Backup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore previously exported TaskFlow JSON backup data to your workspace.
            </p>
            <div className="pt-1">
              <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)}>
                Import Backup
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Data & Reset */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Sample Productivity Tasks
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reset your tasks to the default demonstration dataset.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={reloadSampleData}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reload Demo Data
          </Button>
        </div>

        {/* Danger Zone: Clear Data */}
        <div className="pt-4 border-t border-rose-100 dark:border-rose-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
              Clear All Task Data
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Permanently wipe all tasks and activity records from browser localStorage.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsClearModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Persistence Info Note */}
      <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <strong>Privacy & Storage Notice:</strong> TaskFlow stores all data locally in your browser's <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border text-slate-700 dark:text-slate-300">localStorage</code>. No telemetry, account credentials, or task data are sent to external cloud servers. Use the JSON backup tools above if you need to transfer tasks across different browsers.
      </div>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Wipe All Tasks?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              This will permanently delete every task from your browser. We recommend downloading a backup first if you want to keep your records.
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearAllTasks();
                setIsClearModalOpen(false);
              }}
            >
              Yes, Clear Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Backup Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Tasks from JSON"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Paste Backup JSON Content
            </label>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"app":"TaskFlow", "tasks":[...]}'
              className="w-full font-mono text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Import & Restore
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
