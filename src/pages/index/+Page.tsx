import React from 'react'

import type { IndexPageData } from './+data'

import { usePageContext } from '#src/renderer/usePageContext'
import { config } from '#src/config'

export default function Page() {
  const { data } = usePageContext<IndexPageData>()

  return (
    <div className='p-2'>
      <div className='flex items-center gap-2'>
        <img src='/logo.svg' className='size-10' />
        <h1 className='text-3xl font-bold'>{config.settings.title}</h1>
      </div>
      <div className='whitespace-pre'>{JSON.stringify(data, null, 2)}</div>
    </div>
  )
}
