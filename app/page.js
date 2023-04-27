'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SatoriAnimated } from '@/satori'

export default function Photos() {
  const Router = useRouter()
  const [focusedPhoto, setFocusedPhoto] = useState(null)

  return (
    <SatoriAnimated>
      <div
        key='photo-container'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          gap: 8,
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
                width: focusedPhoto === i ? 300 : 180,
                height: 400,
                borderRadius: 0,
                objectFit: 'cover',
                zIndex: 1,
              }}
              onClick={() => Router.push(`/${i + 1}`)}
              onMouseEnter={() => setFocusedPhoto(i)}
              onMouseLeave={() => setFocusedPhoto(null)}
            />
          ))}
      </div>
    </SatoriAnimated>
  )
}
