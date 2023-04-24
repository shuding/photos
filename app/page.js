'use client'

import { SatoriAnimated } from './satori'
import { useRouter } from 'next/navigation'

export default function Photos() {
  const Router = useRouter()
  return (
    <SatoriAnimated>
      <div
        key='photo-container'
        style={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          gap: 32,
        }}
      >
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <img
              key={`photo photo-${i + 1}`}
              src={`/photos/${i + 1}.jpg`}
              style={{
                flexBasis: '18%',
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '10px',
                boxShadow: '0 5px 30px -10px rgba(0, 0, 0, 0.8)',
                zIndex: 1,
              }}
              className='transition-transform duration-300 transform hover:scale-[1.02] cursor-pointer'
              onClick={() => {
                Router.push(`/${i + 1}`)
              }}
            />
          ))}
      </div>
    </SatoriAnimated>
  )
}
