'use client';
import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { SEASONAL_THEMES, resolveThemeBySeason } from '@dumbdee/common-frontend';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(false);
  const [themeId, setThemeId] = useState<string | null>(null);
  const theme = useMemo(() => {
    const season = process.env.NEXT_PUBLIC_SEASON || undefined;
    const forcedId = process.env.NEXT_PUBLIC_THEME_ID || undefined;
    const resolved = themeId || forcedId;
    const preset = resolved
      ? SEASONAL_THEMES.find((t) => t.id === resolved) || resolveThemeBySeason(season)
      : resolveThemeBySeason(season);
    return preset;
  }, [themeId]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('themeId');
      const savedDark = localStorage.getItem('darkMode');
      if (savedTheme) setThemeId(savedTheme);
      if (savedDark) setDark(savedDark === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('themeId', themeId || '');
      localStorage.setItem('darkMode', String(dark));
    } catch {}
  }, [themeId, dark]);

  const styleVars = useMemo(() => {
    const vars = theme.cssVars || {};
    return Object.fromEntries(Object.entries(vars));
  }, [theme]);

  return (
    <Provider store={store}>
      <div style={styleVars} className={dark ? 'dark' : ''}>
        {children}
      </div>
    </Provider>
  );
}
