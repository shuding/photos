'use client'

import { useState, useEffect } from 'react'
import { SatoriAnimated, SatoriEscape } from '../../satori'

export const dynamicParams = false

export default function Photo({ params: { id } }) {
  const [wrap, setWrap] = useState(
    (typeof window === 'undefined' ? 0 : window.innerWidth) < 960
  )

  useEffect(() => {
    const handleResize = () => {
      setWrap((r) => {
        if (r !== window.innerWidth < 960) {
          return !r
        }
        return r
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const row = !wrap && +id % 2

  return (
    <SatoriAnimated>
      <div
        key='main-container'
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
          alignContent: 'center',
        }}
      >
        <div
          key='photo-container'
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: wrap || !row ? 'flex-start' : 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
            flexDirection: row ? 'row' : 'column',
            width: '100%',
            minHeight: '100%',
            gap: 32,
            overflow: 'hidden',
          }}
        >
          <img
            key={`photo photo-${id}`}
            src={`/photos/${id}.jpg`}
            style={{
              ...(!wrap
                ? {
                    flex: row ? '0 0 40%' : '0 0 70%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }
                : {
                    flex: '0 0 auto',
                    width: '100%',
                  }),
              borderRadius: 10,
              objectFit: 'cover',
              zIndex: '2',
              boxShadow: 'rgba(14, 21, 72, 0.45) 0px 25px 36px -12px',
            }}
          />
          <p
            key='photo-description'
            className='text-slate-800'
            style={{
              width: 400,
              maxWidth: '100%',
              minHeight: wrap || !row ? 150 : 0,
              lineHeight: 1.5,
              zIndex: '1',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {`Photo ${id}: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}
          </p>
        </div>
        <SatoriEscape style={{ width: '100%' }}>
          <div className='my-6 text-slate-600 text-sm pb-8 text-center max-w-md mx-auto leading-6'>
            <hr className='my-6' />
            Fluid transitions with{' '}
            <a
              href='https://github.com/vercel/satori'
              target='_blank'
              className='underline hover:text-slate-800'
            >
              Satori
            </a>
            ,{' '}
            <a
              href='https://beta.nextjs.org/docs/getting-started'
              target='_blank'
              className='underline hover:text-slate-800'
            >
              Next.js App Router
            </a>{' '}
            and{' '}
            <a
              href='https://www.framer.com/motion'
              target='_blank'
              className='underline hover:text-slate-800'
            >
              Framer Motion
            </a>
            .<div className='my-2' />
            Crafted by{' '}
            <a
              href='https://twitter.com/joqim/status/1652397711818358784'
              target='_blank'
              className='underline hover:text-slate-800'
            >
              Shu Ding
            </a>
            .
          </div>
        </SatoriEscape>
      </div>
    </SatoriAnimated>
  )
}
