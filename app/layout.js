import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { SatoriBoundary } from './satori'

const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Shu’s photos',
}

const PhotoLink = ({ id }) => (
  <Link
    href={`/${id}`}
    className='px-2 text-blue-800 hover:text-blue-600 transition-colors duration-200'
  >
    Photo {id}
  </Link>
)

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='h-full'>
      <body className={inter.className + ' h-full'}>
        <div className='container m-auto p-4 mt-12 mb-4 text-center'>
          <h1 className='text-4xl font-medium tracking-tight mb-8 text-blue-800 hover:text-blue-600 transition-colors duration-200'>
            <Link href='/'>Shu’s Photos</Link>
          </h1>
          <PhotoLink id='1' />
          <PhotoLink id='2' />
          <PhotoLink id='3' />
          <PhotoLink id='4' />
          <PhotoLink id='5' />
        </div>
        <div className='w-full relative px-8 h-[calc(100vh-280px)]'>
          <SatoriBoundary>{children}</SatoriBoundary>
        </div>
      </body>
    </html>
  )
}
