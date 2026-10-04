import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import Navbar from '@/components/navigation/Navbar';
import BottomNav from '@/components/navigation/BottomNav';
import Footer from '@/components/navigation/Footer';

export const metadata: Metadata = {
  title: 'ScamShield AI — Before You Trust It, Verify It',
  description: 'AI-powered investor protection and digital financial fraud resilience platform. Real-time verification of screenshots, URLs, messages, and documents against authoritative regulatory records.',
  keywords: ['ScamShield AI', 'investor protection', 'fraud verification', 'SEBI', 'RBI', 'phishing detection', 'cyber fraud', '1930 helpline'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white cyber-grid">
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
