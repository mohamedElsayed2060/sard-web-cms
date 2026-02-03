// src/app/layout.jsx
import './globals.css'
import { Inter } from 'next/font/google'
import DisableCtrlWheelZoom from '@/components/DisableCtrlWheelZoom'

const inter = Inter({ subsets: ['latin'] })
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

export const metadata = {
  title: { default: 'Sard', template: '%s | Sard' },
  description:
    'Sard is a storytelling studio and writers’ room developing socially relevant narratives, training new talents, and producing world-class Arabic content.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  metadataBase: new URL(SITE_URL),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + ' bg-black text-white overflow-x-hidden'}>
        <DisableCtrlWheelZoom />
        {children}
      </body>
    </html>
  )
}
