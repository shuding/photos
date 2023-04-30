import React from 'react'
import Content from './content'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]
}

export default function Photo({ params }) {
  return <Content params={params} />
}
