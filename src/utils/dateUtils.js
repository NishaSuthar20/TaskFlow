/**
 * Date Utility Functions
 * Zero dependencies — relies on native JavaScript Date & Intl APIs.
 */

// Formats a date string (YYYY-MM-DD) to a human-readable format like "Oct 15, 2026"
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

// Formats date to relative string: "Today", "Tomorrow", "Yesterday", or "Oct 15"
export function formatRelativeDate(dateString) {
  if (!dateString) return 'No date';
  const status = getDueStatus(dateString, false);
  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';
  if (status === 'yesterday') return 'Yesterday';
  return formatDate(dateString);
}

// Checks if a date string is today
export function isToday(dateString) {
  if (!dateString) return false;
  const today = getTodayDateString();
  return dateString === today;
}

// Checks if a date is strictly in the past (overdue if not completed)
export function isOverdue(dateString, isCompleted = false) {
  if (!dateString || isCompleted) return false;
  const today = getTodayDateString();
  return dateString < today;
}

// Returns 'overdue' | 'today' | 'tomorrow' | 'yesterday' | 'upcoming' | 'no_date'
export function getDueStatus(dateString, isCompleted = false) {
  if (!dateString) return 'no_date';
  if (isCompleted) return 'completed';
  
  const today = getTodayDateString();
  
  if (dateString === today) return 'today';
  if (dateString < today) return 'overdue';

  // Check tomorrow
  const tomorrow = getOffsetDateString(1);
  if (dateString === tomorrow) return 'tomorrow';

  // Check yesterday
  const yesterday = getOffsetDateString(-1);
  if (dateString === yesterday) return 'yesterday';

  return 'upcoming';
}

// Helper to get today's local date as YYYY-MM-DD
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get offset date from today as YYYY-MM-DD
export function getOffsetDateString(offsetDays = 0) {
  const target = new Date();
  target.setDate(target.getDate() + offsetDays);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Dynamic productivity greeting based on current local hour
export function getProductivityGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Formats relative time (e.g., "Just now", "5m ago", "2h ago")
export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Recently';
  const now = Date.now();
  const diffMs = now - Number(timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}

