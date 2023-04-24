'use client'

import React from 'react'
import { SatoriAnimated } from '../satori'

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]
}

export default function Photo({ params }) {
  const { id } = params

  return (
    <SatoriAnimated>
      <div
        key='photo-container'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
          alignContent: 'center',
          flexDirection: +id % 2 ? 'row' : 'column',
          width: '100%',
          height: '100%',
          gap: 32,
        }}
      >
        <img
          key={`photo photo-${id}`}
          src={`/photos/${id}.jpg`}
          style={{
            flexBasis: '50%',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '10px',
            boxShadow: '0 5px 30px -10px rgba(0, 0, 0, 0.8)',
            zIndex: 2,
          }}
        />
        <p
          key='photo-description'
          style={{
            margin: 0,
            width: 400,
            letterSpacing: -0.02,
            zIndex: 1,
          }}
        >{`Photo ${id}: lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`}</p>
      </div>
    </SatoriAnimated>
  )
}
