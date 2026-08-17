import type { Metadata, Viewport } from 'next';
import { Chakra_Petch, Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { site } from '@/data/site';
import './globals.css';

/**
 * Three families, loaded through next/font so they are self-hosted and
 * preloaded — no render-blocking request to fonts.googleapis.com, and no
 * layout shift when they land.
 */
const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-chakra',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    'gameplay editor',
    'gaming montage editor',
    'esports video editor',
    'thumbnail designer',
    'Valorant montage',
    'PUBG Mobile edit',
    'Free Fire montage',
    site.name,
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
    url: site.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0f',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
