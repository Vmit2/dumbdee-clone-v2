export type ThemePreset = {
  id: string;
  name: string;
  /** Tailwind-compatible CSS vars or class names */
  cssVars: Record<string, string>;
  /** Suggested gradient for hero/banners */
  gradient: string;
};

export const SEASONAL_THEMES: ThemePreset[] = [
  {
    id: "spring-bloom",
    name: "Spring Bloom",
    cssVars: {
      "--bg": "#f0fdf4",
      "--fg": "#064e3b",
      "--primary": "#10b981",
      "--accent": "#84cc16"
    },
    gradient: "bg-gradient-to-r from-emerald-300 via-lime-300 to-emerald-500"
  },
  {
    id: "summer-sunset",
    name: "Summer Sunset",
    cssVars: {
      "--bg": "#fff7ed",
      "--fg": "#7c2d12",
      "--primary": "#f97316",
      "--accent": "#fb7185"
    },
    gradient: "bg-gradient-to-r from-orange-300 via-rose-300 to-orange-500"
  },
  {
    id: "autumn-spice",
    name: "Autumn Spice",
    cssVars: {
      "--bg": "#fffbeb",
      "--fg": "#78350f",
      "--primary": "#d97706",
      "--accent": "#a78bfa"
    },
    gradient: "bg-gradient-to-r from-amber-300 via-violet-300 to-amber-500"
  },
  {
    id: "winter-frost",
    name: "Winter Frost",
    cssVars: {
      "--bg": "#eff6ff",
      "--fg": "#0c4a6e",
      "--primary": "#3b82f6",
      "--accent": "#22d3ee"
    },
    gradient: "bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-500"
  },
  {
    id: "holiday-festival",
    name: "Holiday Festival",
    cssVars: {
      "--bg": "#fef2f2",
      "--fg": "#7f1d1d",
      "--primary": "#ef4444",
      "--accent": "#22c55e"
    },
    gradient: "bg-gradient-to-r from-rose-300 via-emerald-300 to-rose-500"
  },
  {
    id: "monsoon-mist",
    name: "Monsoon Mist",
    cssVars: {
      "--bg": "#ecfeff",
      "--fg": "#083344",
      "--primary": "#06b6d4",
      "--accent": "#60a5fa"
    },
    gradient: "bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-500"
  }
];

export function resolveThemeBySeason(season: string | undefined): ThemePreset {
  const map: Record<string, string> = {
    spring: "spring-bloom",
    summer: "summer-sunset",
    autumn: "autumn-spice",
    fall: "autumn-spice",
    winter: "winter-frost",
    holiday: "holiday-festival",
    monsoon: "monsoon-mist"
  };
  const id = (season && map[season.toLowerCase()]) || SEASONAL_THEMES[0].id;
  return SEASONAL_THEMES.find((t) => t.id === id) || SEASONAL_THEMES[0];
}

