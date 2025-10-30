'use client';
import { useEffect, useState } from 'react';
import GA from './GA';
import Pixel from './Pixel';

type Flags = Partial<{
  analytics_enabled: boolean;
  enable_meta_pixel: boolean;
}>;

export default function AnalyticsSwitch() {
  const [flags, setFlags] = useState<Flags>({});
  useEffect(() => {
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || (typeof window!== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:4000` : 'http://localhost:4000');
        const res = await fetch(base + '/api/v1/features');
        if (res.ok) {
          const data = await res.json();
          setFlags(data || {});
          return;
        }
      } catch {}
      // Fallback to env toggles
      setFlags({
        analytics_enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
        enable_meta_pixel: process.env.NEXT_PUBLIC_ENABLE_META_PIXEL === 'true'
      });
    })();
  }, []);
  if (!flags.analytics_enabled) return null;
  return (
    <>
      <GA />
      {flags.enable_meta_pixel ? <Pixel /> : null}
    </>
  );
}


