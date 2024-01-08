import type { Metadata } from 'next'
import { Open_Sans as Font } from 'next/font/google'
import './globals.css'

const font = Font({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
})

export const metadata: Metadata = {
  title: 'Alt HN',
  description: 'Alternative read-only Hacker News',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
