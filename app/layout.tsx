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
  title: 'VocabQuest - אפליקציית למידת שפות אינטראקטיבית',
  description: 'למדו שפות חדשות דרך חוויה אינטראקטיבית ומהנה עם VocabQuest',
  keywords: 'למידת שפות, ספרדית, קוריאנית, צרפתית, אוצר מילים, אינטראקטיבי',
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
    title: 'VocabQuest - אפליקציית למידת שפות אינטראקטיבית',
    description: 'למדו שפות חדשות דרך חוויה אינטראקטיבית ומהנה',
    url: 'http://localhost:3000',
    siteName: 'VocabQuest',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VocabQuest Language Learning',
      },
    ],
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VocabQuest - אפליקציית למידת שפות אינטראקטיבית',
    description: 'למדו שפות חדשות דרך חוויה אינטראקטיבית ומהנה',
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
    <html lang="he" dir="rtl" className={`${notoSansKR.variable} ${heebo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta tags for accessibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6366F1" />
        <meta name="color-scheme" content="light" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'VocabQuest',
              description: 'אפליקציית למידת שפות אינטראקטיבית',
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
        <div id="root" className="min-h-screen bg-gray-50 text-gray-900">
          {children}
        </div>
        
        {/* Accessibility improvements */}
        <div id="a11y-announcements" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          דלג לתוכן הראשי
        </a>
      </body>
    </html>
  );
}
