import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'

const siteUrl = 'https://yanchenhao.com'
const siteTitle = "Yanchenhao's Corner"
const siteDescription =
  'A scrapbook-style personal portfolio for Yanchenhao, a frontend engineer who loves building interactive web experiences, traveling, photography, and music.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteTitle,
  title: {
    default: `${siteTitle} | Frontend Developer`,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  keywords: [
    'Yanchenhao',
    'Chenhao Yan',
    'frontend engineer',
    'frontend developer',
    'personal portfolio',
    'interactive web experiences',
  ],
  authors: [{ name: 'Yanchenhao', url: siteUrl }],
  creator: 'Yanchenhao',
  publisher: 'Yanchenhao',
  alternates: {
    canonical: '/',
  },
  category: 'portfolio',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: `${siteTitle} | Frontend Developer`,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteTitle} | Frontend Developer`,
    description: siteDescription,
    images: ['/og-image.png'],
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
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Kalam:wght@300;400;700&family=LXGW+WenKai&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Zhi+Mang+Xing&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main>
          {/* <Navbar /> */}
          {children}
          {/* <Footer /> */}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
