import type { Metadata } from 'next';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { Noto_Sans_KR, Heebo } from 'next/font/google';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VocabQuest — Interactive Language Learning',
  description: 'Learn Japanese, Korean, and French through fun, interactive vocabulary games and lessons.',
  keywords: 'language learning, Japanese, Korean, French, vocabulary, interactive, TOPIK, JLPT',
  authors: [{ name: 'VocabQuest Team' }],
  creator: 'VocabQuest',
  publisher: 'VocabQuest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'VocabQuest — Interactive Language Learning',
    description: 'Learn Japanese, Korean, and French through fun, interactive vocabulary games and lessons.',
    url: siteUrl,
    siteName: 'VocabQuest',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VocabQuest Language Learning',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VocabQuest — Interactive Language Learning',
    description: 'Learn Japanese, Korean, and French through fun, interactive vocabulary games and lessons.',
    images: ['/images/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${notoSansKR.variable} ${heebo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/app-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="VocabQuest" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags for accessibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8f74b5" />
        <meta name="color-scheme" content="light" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'VocabQuest',
              description: 'Interactive language learning application',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body className={`${notoSansKR.variable} ${heebo.variable} antialiased`}>
        <div id="main-content" className="min-h-screen bg-pastel-cream text-brand-800">
          <ClientProviders>{children}</ClientProviders>
        </div>
        
        {/* Accessibility improvements */}
        <div id="a11y-announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-400 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}
