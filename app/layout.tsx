import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Poppins } from 'next/font/google'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Python Treasure Hunt',
  description: 'A scavenger hunt coding challenge',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.className}`}
      >
        {children}
      </body>
    </html>
  )
}
