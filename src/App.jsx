import React from 'react';
import { TaskProvider } from './context/TaskContext';
import AppLayout from './components/layout/AppLayout';

/**
 * TaskFlow Application Root
 * Wraps the application shell inside the TaskProvider state layer.
 */
export default function App() {
  return (
    <TaskProvider>
      <AppLayout />
    </TaskProvider>
  );
}
