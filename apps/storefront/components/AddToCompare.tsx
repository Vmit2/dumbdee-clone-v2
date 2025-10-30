"use client";
import React from 'react';

export default function AddToCompare({ slug }: { slug: string }) {
  function handleClick() {
    try {
      const k = 'compareSlugs';
      const s = JSON.parse(localStorage.getItem(k) || '[]');
      const next = [slug].concat(Array.isArray(s) ? s : [])
        .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        .slice(0, 4);
      localStorage.setItem(k, JSON.stringify(next));
      window.dispatchEvent(new Event('compare:update'));
    } catch {}
  }
  return (
    <button className="border px-3 py-1 rounded text-sm" onClick={handleClick}>
      Add to compare
    </button>
  );
}


