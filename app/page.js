'use client'

import { SatoriAnimated } from './satori'
import { useRouter } from 'next/navigation'

export default function Photos() {
  const Router = useRouter()
  return (
    <SatoriAnimated>
      <div
        key='photo-container'
        tw='flex justify-center items-center w-full h-full'
        style={{
          gap: 32,
        }}
      >
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <img
              key={`photo photo-${i + 1}`}
              src={`/photos/${i + 1}.jpg`}
              tw='max-w-full max-h-full z-[1]'
              style={{
                flexBasis: '18%',
                borderRadius: '10px',
                boxShadow: '0 5px 30px -10px rgba(0, 0, 0, 0.8)',
              }}
              className='transition-transform duration-300 transform hover:scale-[1.02] cursor-pointer'
              onClick={() => Router.push(`/${i + 1}`)}
            />
          ))}
      </div>
    </SatoriAnimated>
  )
}
