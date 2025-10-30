'use client';
import { useEffect, useState } from 'react';

export default function MaintenanceBanner() {
  const [on, setOn] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || (typeof window!== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:4000` : 'http://localhost:4000');
        const res = await fetch(base + '/api/v1/features');
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.maintenance === 'boolean') setOn(!!data.maintenance);
          else setOn(process.env.NEXT_PUBLIC_MAINTENANCE === 'true');
          return;
        }
      } catch {}
      setOn(process.env.NEXT_PUBLIC_MAINTENANCE === 'true');
    })();
  }, []);
  if (!on) return null;
  return (
    <div className="w-full text-center text-sm text-white bg-yellow-600 py-1">Maintenance mode: some features may be unavailable.</div>
  );
}


