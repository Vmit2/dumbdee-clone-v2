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
    const preset = themeId
      ? SEASONAL_THEMES.find((t) => t.id === themeId) || resolveThemeBySeason(season)
      : resolveThemeBySeason(season);
    return preset;
  }, [themeId]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('vendorThemeId');
      const savedDark = localStorage.getItem('vendorDarkMode');
      if (savedTheme) setThemeId(savedTheme);
      if (savedDark) setDark(savedDark === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vendorThemeId', themeId || '');
      localStorage.setItem('vendorDarkMode', String(dark));
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
