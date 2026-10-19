import { getTodayDateString, getOffsetDateString } from '../utils/dateUtils';

/**
 * Realistic Sample Tasks for TaskFlow Initial Experience
 * Demonstrates high, medium, and low priority, various categories,
 * and realistic date distributions (overdue, due today, upcoming, completed).
 */
export function getInitialSampleTasks() {
  const today = getTodayDateString();
  const yesterday = getOffsetDateString(-1);
  const tomorrow = getOffsetDateString(1);
  const inThreeDays = getOffsetDateString(3);
  const inFiveDays = getOffsetDateString(5);

  return [
    {
      id: 'task-1',
      title: 'Finalize quarterly product roadmap',
      description: 'Review high-priority feature requests, resource bandwidth, and align OKRs with leadership.',
      priority: 'high',
      status: 'in_progress',
      dueDate: today,
      category: 'Planning',
      createdAt: Date.now() - 3600000 * 24 * 2,
      completedAt: null,
    },
    {
      id: 'task-2',
      title: 'Review user onboarding analytics and drop-off rates',
      description: 'Investigate step 3 funnel drop-offs and draft UX recommendations for the mobile signup flow.',
      priority: 'high',
      status: 'pending',
      dueDate: yesterday, // Overdue task to demonstrate overdue warnings
      category: 'Analytics',
      createdAt: Date.now() - 3600000 * 24 * 3,
      completedAt: null,
    },
    {
      id: 'task-3',
      title: 'Refactor design system button & badge components',
      description: 'Ensure color contrast meets WCAG AAA standards and export unified CSS tokens.',
      priority: 'medium',
      status: 'in_progress',
      dueDate: today,
      category: 'Design System',
      createdAt: Date.now() - 3600000 * 12,
      completedAt: null,
    },
    {
      id: 'task-4',
      title: 'Prepare presentation deck for investor sync',
      description: 'Compile monthly active user growth, retention cohorts, and projected ARR slide.',
      priority: 'high',
      status: 'pending',
      dueDate: tomorrow,
      category: 'Strategy',
      createdAt: Date.now() - 3600000 * 8,
      completedAt: null,
    },
    {
      id: 'task-5',
      title: 'Conduct team sprint retrospective',
      description: 'Gather feedback on last release cycle, identify bottlenecks, and document action items.',
      priority: 'low',
      status: 'pending',
      dueDate: inThreeDays,
      category: 'Team',
      createdAt: Date.now() - 3600000 * 4,
      completedAt: null,
    },
    {
      id: 'task-6',
      title: 'Audit application performance & bundle size',
      description: 'Analyze webpack/vite chunks, compress static SVGs, and verify Lighthouse score is above 95.',
      priority: 'medium',
      status: 'completed',
      dueDate: yesterday,
      category: 'Engineering',
      createdAt: Date.now() - 3600000 * 24 * 4,
      completedAt: Date.now() - 3600000 * 6,
    },
    {
      id: 'task-7',
      title: 'Schedule quarterly dental checkup',
      description: 'Book morning appointment and submit flex benefit insurance claim.',
      priority: 'low',
      status: 'pending',
      dueDate: inFiveDays,
      category: 'Personal',
      createdAt: Date.now() - 3600000 * 2,
      completedAt: null,
    }
  ];
}

