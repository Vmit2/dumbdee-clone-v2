'use client';
import { useEffect, useState } from 'react';

export function LanguageCurrencySwitcher() {
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('INR');
  useEffect(() => {
    try {
      const l = localStorage.getItem('lang'); if (l) setLang(l);
      const c = localStorage.getItem('currency'); if (c) setCurrency(c);
    } catch {}
    (async ()=>{
      try {
        const c = localStorage.getItem('currency');
        if (!c) {
          const r = await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/v1/public/geo');
          const j = await r.json();
          if (j?.currency) setCurrency(j.currency);
        }
      } catch {}
    })();
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);
      localStorage.setItem('currency', currency);
      if (typeof document !== 'undefined') document.documentElement.lang = lang;
    } catch {}
  }, [lang, currency]);
  return (
    <div className="flex items-center gap-2 text-sm">
      <select className="border px-2 py-1 rounded" value={lang} onChange={(e)=>setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="es">Español</option>
      </select>
      <select className="border px-2 py-1 rounded" value={currency} onChange={(e)=>setCurrency(e.target.value)}>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </div>
  );
}

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { try { const d = localStorage.getItem('darkMode'); if (d) setDark(d==='true'); } catch {} }, []);
  function toggle() {
    const next = !dark; setDark(next);
    try { localStorage.setItem('darkMode', String(next)); } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
    }
    // Also dispatch a custom event in case Providers listens
    window.dispatchEvent(new CustomEvent('toggle-dark', { detail: { dark: next } }));
  }
  return <button onClick={toggle} className="border px-2 py-1 rounded text-sm">{dark ? 'Light' : 'Dark'}</button>;
}


