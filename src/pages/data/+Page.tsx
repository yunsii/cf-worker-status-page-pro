import React, { useState } from 'react'

export default Page

function Page() {
  const [id, setId] = useState<string>('')

  return (
    <>
      <h1 className='text-3xl font-bold'>Data</h1>
      <p>Example of using R2 and KV</p>
      <div>
        id
        <input
          value={id}
          onChange={(event) => {
            setId(event.target.value)
          }}
          className='mx-2 border'
        />
        <button
          className='border px-4 hover:bg-gray-100'
          onClick={() => {
            if (id?.trim()) {
              window.location.href = `/data/${id.trim()}`
              return
            }
            // eslint-disable-next-line no-alert
            alert('Invalid id')
          }}
        >
          Go
        </button>
      </div>
    </>
  )
}
