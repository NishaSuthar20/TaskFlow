import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 * Manages Dark Mode & Light Mode across the entire application.
 * Persists the choice in localStorage and applies the 'dark' class to the <html> root element.
 */
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check if user already has a saved preference
    const savedTheme = localStorage.getItem('taskflow_theme');
    if (savedTheme) {
      return savedTheme;
    }
    // 2. Otherwise default to user's operating system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for simple consumption in components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

