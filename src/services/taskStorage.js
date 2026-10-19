import { getInitialSampleTasks } from './sampleData';

const TASKS_KEY = 'taskflow_tasks_v1';
const ACTIVITY_KEY = 'taskflow_activity_v1';

/**
 * TaskStorage Service
 * Handles persistence to browser localStorage with error recovery,
 * automatic demo seeding, and activity logging.
 */
export const taskStorage = {
  // Load tasks from localStorage (or seed with realistic samples if first launch)
  getTasks() {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      if (!stored) {
        const initial = getInitialSampleTasks();
        this.saveTasks(initial);
        this.logActivity('System initialized with sample productivity tasks');
        return initial;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error loading tasks from localStorage:', err);
      return [];
    }
  },

  // Save tasks array to localStorage
  saveTasks(tasks) {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
      return false;
    }
  },

  // Retrieve activity log
  getActivity() {
    try {
      const stored = localStorage.getItem(ACTIVITY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error reading activity log:', err);
      return [];
    }
  },

  // Add an item to the activity log (keeps the 20 most recent entries)
  logActivity(description, meta = {}) {
    try {
      const logs = this.getActivity();
      const newEntry = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        description,
        timestamp: Date.now(),
        ...meta,
      };
      const updated = [newEntry, ...logs].slice(0, 20);
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error('Error logging activity:', err);
      return [];
    }
  },

  // Reset tasks to fresh sample data
  resetToSample() {
    const samples = getInitialSampleTasks();
    this.saveTasks(samples);
    this.logActivity('Reset all tasks to default sample data');
    return samples;
  },

  // Clear all tasks
  clearAll() {
    this.saveTasks([]);
    this.logActivity('Cleared all tasks from storage');
    return [];
  },

  // Export tasks as JSON string
  exportBackup() {
    const tasks = this.getTasks();
    const data = {
      app: 'TaskFlow',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
    };
    return JSON.stringify(data, null, 2);
  },

  // Import tasks from JSON string
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.tasks)) {
        this.saveTasks(parsed.tasks);
        this.logActivity(`Imported ${parsed.tasks.length} tasks from backup file`);
        return parsed.tasks;
      }
      throw new Error('Invalid backup file format: missing tasks array');
    } catch (err) {
      console.error('Failed to import backup:', err);
      throw err;
    }
  }
};

