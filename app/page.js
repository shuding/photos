'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SatoriAnimated, SatoriEscape } from '@/satori'

const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0)

export default function Photos() {
  const Router = useRouter()
  const [focusedPhoto, setFocusedPhoto] = useState(null)
  const [row, setRow] = useState(
    (typeof window === 'undefined' ? 0 : window.innerWidth) > 960
  )

  useEffect(() => {
    const handleResize = () => {
      setRow((r) => {
        if (r !== window.innerWidth > 960) {
          setFocusedPhoto(null)
          return !r
        }
        return r
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
            justifyContent: row ? 'center' : 'flex-start',
            alignItems: 'center',
            flexDirection: row ? 'row' : 'column',
            width: '100%',
            minHeight: '100%',
            gap: 8,
            overflow: 'hidden',
          }}
        >
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <img
                key={`photo photo-${i + 1}`}
                src={`/photos/${i + 1}.jpg`}
                className='cursor-pointer'
                style={{
                  width: row
                    ? focusedPhoto === i
                      ? 300
                      : focusedPhoto === null
                      ? 180
                      : 150
                    : '100%',
                  height: row ? 380 : focusedPhoto === i ? 200 : 120,
                  borderRadius: 0,
                  objectFit: 'cover',
                  boxShadow: '0 10px 20px -8px rgba(14, 21, 72, 0.45)',
                  zIndex: '1',
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
                onPointerUp={() => {
                  Router.push(`/${i + 1}`)
                  //setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  // }, 100)
                }}
                onMouseEnter={() => !isTouchDevice && setFocusedPhoto(i)}
                onMouseLeave={() => !isTouchDevice && setFocusedPhoto(null)}
              />
            ))}
          {row ? null : (
            <div
              key='slot'
              style={{
                width: 32,
                height: 32,
              }}
            ></div>
          )}
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
              href='https://twitter.com/shuding_/status/1652485125085581314'
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
