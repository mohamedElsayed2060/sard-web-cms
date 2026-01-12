// src/app/layout.jsx
import './globals.css'
import { Inter } from 'next/font/google'

import { TransitionProvider } from '@/components/transition/TransitionProvider'
import DoorOverlay from '@/components/transition/DoorOverlay'
import TransitionBridge from '@/components/transition/TransitionBridge'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: 'Sard',
    template: '%s | Sard',
  },
  description:
    'Sard is a storytelling studio and writers’ room developing socially relevant narratives, training new talents, and producing world-class Arabic content.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    // apple: [{ url: '/apple-touch-icon.png' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-black text-white overflow-x-hidden'}>
        <TransitionProvider>
          <DoorOverlay />
          <TransitionBridge />
          {children}
          {/* <div id="app-shell">{children}</div> */}
        </TransitionProvider>
      </body>
    </html>
  )
}
