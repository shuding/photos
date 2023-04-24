import React from 'react'
import { SatoriAnimated } from '../satori'

export const dynamicParams = false
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]
}

export default function Photo({ params: { id } }) {
  return (
    <SatoriAnimated>
      <div
        key='photo-container'
        tw='flex flex-wrap justify-center items-center content-center w-full h-full'
        style={{
          flexDirection: +id % 2 ? 'row' : 'column',
          gap: 32,
        }}
      >
        <img
          key={`photo photo-${id}`}
          src={`/photos/${id}.jpg`}
          tw='max-w-full max-h-full z-[2]'
          style={{
            flexBasis: '50%',
            borderRadius: 10,
            boxShadow: '0 5px 30px -10px rgba(0, 0, 0, 0.8)',
          }}
        />
        <p
          key='photo-description'
          style={{
            width: 400,
            zIndex: 1,
          }}
        >{`Photo ${id}: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}</p>
      </div>
    </SatoriAnimated>
  )
}
