import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { fontMono, fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import Providers from './providers';
import { CardProvider } from './store/card-providers';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.appUrl),
  title: siteConfig.name,
  description: siteConfig.description,
  generator: 'Next.js',
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  keywords: [],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    images: [siteConfig.ogImage],
    description: siteConfig.description,
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} - %s`,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.name}`,
  },
};

export const viewport: Viewport = {
  width: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    // { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className={cn(
          'flex min-h-screen flex-col bg-black font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <CardProvider>
          <Providers>
            <Header />
            <main className='flex-1'>{children}</main>
            <Toaster
              position='top-center'
              toastOptions={{
                style: {
                  background: '#1f2937',
                  color: '#f9fafb',
                  border: '1px solid #374151',
                },
                classNames: {
                  success: 'success-toast',
                  error: 'error-toast',
                  warning: 'warning-toast',
                  info: 'info-toast',
                },
              }}
            />
            <Footer />
          </Providers>
        </CardProvider>
      </body>
    </html>
  );
}
