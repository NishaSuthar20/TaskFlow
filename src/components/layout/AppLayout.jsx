import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import TaskFormModal from '../tasks/TaskFormModal';
import ConfirmDeleteModal from '../tasks/ConfirmDeleteModal';
import { useTasks } from '../../context/TaskContext';

// Page Views
import DashboardView from '../../pages/DashboardView';
import TasksView from '../../pages/TasksView';
import TodayView from '../../pages/TodayView';
import UpcomingView from '../../pages/UpcomingView';
import CompletedView from '../../pages/CompletedView';
import PrioritiesView from '../../pages/PrioritiesView';
import SettingsView from '../../pages/SettingsView';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeView, toast, setToast, openCreateModal, isTaskModalOpen } = useTasks();

  // Keyboard shortcut: Press 'N' to open New Task modal (unless user is typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTaskModalOpen) return;
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openCreateModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, openCreateModal]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'completed':
        return <CompletedView />;
      case 'priorities':
        return <PrioritiesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Sticky Top Header */}
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <TaskFormModal />
      <ConfirmDeleteModal />

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

