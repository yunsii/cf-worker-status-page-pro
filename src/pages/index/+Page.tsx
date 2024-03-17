import React from 'react'
import { cls } from 'tagged-classnames-free'

import MonitorPanel from './components/MonitorPanel'

import type { IndexPageData } from './+data'

import { usePageContext } from '#src/renderer/usePageContext'
import { config } from '#src/config'

export default function Page() {
  const { data } = usePageContext<IndexPageData>()

  return (
    <div className='container max-w-screen-xl'>
      <div className='flex items-center gap-2'>
        <img src='/logo.svg' className='size-10' />
        <h1 className='text-3xl'>{config.settings.title}</h1>
      </div>
      <MonitorPanel data={data} className={cls`mt-4`} />
    </div>
  )
}
