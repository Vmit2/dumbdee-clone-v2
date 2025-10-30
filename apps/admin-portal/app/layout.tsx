import './globals.css';
import Providers from '../components/Providers';
import MaintenanceBanner from '../components/MaintenanceBanner';
export const metadata = { title: 'Admin Portal' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body><Providers><MaintenanceBanner />{children}</Providers></body></html>
  );
}
