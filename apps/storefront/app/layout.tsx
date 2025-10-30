import './globals.css';
import Providers from '../components/Providers';
import AnalyticsSwitch from '../components/analytics/AnalyticsSwitch';
import MaintenanceBanner from '../components/MaintenanceBanner';
import { LanguageCurrencySwitcher, DarkModeToggle } from '../components/Switchers';
import CompareSidebar from '../components/CompareSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsletterBanner from '../components/NewsletterBanner';
import PopupModal from '../components/PopupModal';

export const metadata = {
  title: 'Storefront',
  description: 'Multi-vendor marketplace storefront',
  openGraph: {
    title: 'Storefront',
    description: 'Multi-vendor marketplace storefront',
    type: 'website'
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <Providers>
          <MaintenanceBanner />
          <Header />
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
          <CompareSidebar />
          <PopupModal />
          <NewsletterBanner />
          <AnalyticsSwitch />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
