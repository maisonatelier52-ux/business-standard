import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllCategories } from '@/lib/db';
import './globals.css';

const SITE_URL = 'https://www.financial-journal.xyz';
const SITE_NAME = 'Financial Journal';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Financial Journal - The Leading Business Journal',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Get the latest news on markets, economy, companies, politics, technology, and more on Financial Journal.',
  keywords: 'business news, stock market, economy, companies, politics, technology',
  authors: [{ name: `${SITE_NAME} Editorial Team` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Financial Journal - The Leading Business Journal',
    description: 'Get the latest news on markets, economy, companies, politics, technology, and more on Financial Journal.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/images/img.webp`,
        width: 1200,
        height: 630,
        alt: 'Financial Journal - The Leading Business Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Journal - The Leading Business Journal',
    description: 'Get the latest news on markets, economy, companies, politics, technology, and more on Financial Journal.',
    images: [`${SITE_URL}/images/img.webp`],
    creator: '@financialjournal',
    site: '@financialjournal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
