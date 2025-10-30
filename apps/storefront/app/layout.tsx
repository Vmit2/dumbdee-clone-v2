import './globals.css';
import Providers from '../components/Providers';
import AnalyticsSwitch from '../components/analytics/AnalyticsSwitch';
import MaintenanceBanner from '../components/MaintenanceBanner';

export const metadata = { title: 'Storefront' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MaintenanceBanner />
          {children}
          <AnalyticsSwitch />
        </Providers>
      </body>
    </html>
  );
}
