/**
 * Filter & Sorting Helper Functions
 */

export function filterAndSortTasks(tasks, {
  searchQuery = '',
  filterStatus = 'all',
  filterPriority = 'all',
  filterCategory = 'all',
  sortBy = 'dueDate',
  sortOrder = 'asc',
}) {
  return tasks
    .filter(task => {
      // 1. Search Query filter (matches title and description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        const matchesCat = (task.category || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // 2. Status filter
      if (filterStatus !== 'all' && task.status !== filterStatus) {
        return false;
      }

      // 3. Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }

      // 4. Category filter
      if (filterCategory !== 'all' && task.category !== filterCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate': {
          // Tasks without due dates sort to the bottom
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.localeCompare(b.dueDate);
          break;
        }

        case 'priority': {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          const weightA = priorityWeights[a.priority] || 0;
          const weightB = priorityWeights[b.priority] || 0;
          // Default highest priority first
          comparison = weightB - weightA;
          break;
        }

        case 'title': {
          comparison = a.title.localeCompare(b.title);
          break;
        }

        case 'created':
        default: {
          comparison = (b.createdAt || 0) - (a.createdAt || 0);
          break;
        }
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
}

