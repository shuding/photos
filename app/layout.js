import './globals.css'
import { Inter } from 'next/font/google'

import Link from 'next/link'
import { SatoriBoundary } from '@/satori'
import { PhotoLink } from './photo-link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shu’s Photos',
  description:
    'Fluid transitions with Satori, Next.js App Router and Framer Motion.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta
          property='og:image'
          content='https://shu-gallery.vercel.app/og.png'
        />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:site' content='@shuding_' />
        <meta property='twitter:title' content='Shu’s Photos' />
        <meta
          property='twitter:description'
          content='Fluid transitions with Satori, Next.js App Router and Framer Motion.'
        />
        <meta
          property='twitter:url'
          content='https://shu-gallery.vercel.app/'
        />
        <meta
          property='twitter:image'
          content='https://shu-gallery.vercel.app/og.png'
        />
        <link rel='preload' href='/photos/1.jpg' as='image' />
        <link rel='preload' href='/photos/2.jpg' as='image' />
        <link rel='preload' href='/photos/3.jpg' as='image' />
        <link rel='preload' href='/photos/4.jpg' as='image' />
        <link rel='preload' href='/photos/5.jpg' as='image' />
        <link
          rel='preload'
          href='/photos/1.jpg'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/photos/2.jpg'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/photos/3.jpg'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/photos/4.jpg'
          as='fetch'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/photos/5.jpg'
          as='fetch'
          crossOrigin='anonymous'
        />
      </head>
      <body className={inter.className}>
        <div className='container m-auto p-4 mb-4 text-center'>
          <Link href='/'>
            <h1 className='text-2xl font-medium tracking-tight mt-12 mb-8 text-slate-800 hover:text-blue-600 inline-block'>
              All Photos
            </h1>
          </Link>
          <div></div>
          <PhotoLink id='1' />
          <PhotoLink id='2' />
          <PhotoLink id='3' />
          <PhotoLink id='4' />
          <PhotoLink id='5' />
        </div>
        <div className='w-full relative px-8 pb-8 h-[calc(100vh-380px)] min-h-[400px]'>
          <SatoriBoundary>{children}</SatoriBoundary>
        </div>
      </body>
    </html>
  )
}
