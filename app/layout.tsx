import type { Metadata } from 'next';
import { Noto_Sans_KR, Heebo } from 'next/font/google';
import './globals.css';

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
  title: 'VocabQuest - Interactive Language Learning Journey',
  description: 'Learn Korean vocabulary through an interactive journey across South Korea. Progress through stations, complete quizzes, and unlock new areas with gamified learning.',
  keywords: 'Korean, language learning, vocabulary, interactive, gamification, education',
  authors: [{ name: 'VocabQuest Team' }],
  creator: 'VocabQuest',
  publisher: 'VocabQuest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'VocabQuest - Interactive Language Learning Journey',
    description: 'Learn Korean vocabulary through an interactive journey across South Korea.',
    url: 'http://localhost:3000',
    siteName: 'VocabQuest',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VocabQuest Korean Learning Journey',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VocabQuest - Interactive Language Learning Journey',
    description: 'Learn Korean vocabulary through an interactive journey across South Korea.',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags for accessibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'VocabQuest',
              description: 'Interactive language learning application for Korean vocabulary',
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
        <div id="root" className="min-h-screen bg-background text-text">
          {children}
        </div>
        
        {/* Accessibility improvements */}
        <div id="a11y-announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}
