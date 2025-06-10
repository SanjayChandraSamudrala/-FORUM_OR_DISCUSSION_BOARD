import React, { useEffect, useState } from 'react';
import { Switch } from './switch';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span role="img" aria-label="Light">🌞</span>
      <Switch checked={isDark} onCheckedChange={setIsDark} />
      <span role="img" aria-label="Dark">🌜</span>
    </div>
  );
};

export default ThemeToggle; 