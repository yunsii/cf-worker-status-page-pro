import React, { useState } from 'react'

import type { AboutPageData } from './+data'

import { usePageContext } from '#src/renderer/usePageContext'

export default function Page() {
  const { data } = usePageContext<AboutPageData>()

  const [r2Data, setR2Data] = useState(data.r2Data || '')
  const [kvData, setKvData] = useState(data.kvData || '')

  return (
    <>
      <h1 className='text-3xl font-bold'>About</h1>
      <p>Example of using Vike.</p>
      <div>
        data:
        {JSON.stringify(data)}
      </div>
      <div className='mb-2'>
        r2Data
        <input
          value={r2Data}
          onChange={(event) => {
            setR2Data(event.target.value)
          }}
          className='mx-2 border'
        />
        <button
          className='border px-4 hover:bg-gray-100'
          onClick={async () => {
            const result = await fetch('/api/store/r2', {
              method: 'POST',
              headers: {
                'content-type': 'text/plain',
              },
              body: r2Data,
            })
            if (result.ok) {
              window.location.reload()
            }
          }}
        >
          Store
        </button>
      </div>
      <div>
        kvData
        <input
          value={kvData}
          onChange={(event) => {
            setKvData(event.target.value)
          }}
          className='mx-2 border'
        />
        <button
          className='border px-4 hover:bg-gray-100'
          onClick={async () => {
            const result = await fetch('/api/store/kv', {
              method: 'POST',
              headers: {
                'content-type': 'text/plain',
              },
              body: kvData,
            })
            if (result.ok) {
              window.location.reload()
            }
          }}
        >
          Store
        </button>
      </div>
    </>
  )
}
