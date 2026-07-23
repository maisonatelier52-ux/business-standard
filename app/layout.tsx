import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllCategories } from '@/lib/db';
import './globals.css';

export const metadata: Metadata = {
  title: 'Business Standard - The Leading Business Journal',
  description: 'Get the latest news on markets, economy, companies, politics, technology, and more on Business Standard.',
  keywords: 'business news, stock market, economy, companies, politics, technology',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const currentLang = cookieStore.get('app_lang')?.value || 'en';
  const categories = getAllCategories();

  return (
    <html lang={currentLang}>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Header categories={categories} currentLang={currentLang} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
