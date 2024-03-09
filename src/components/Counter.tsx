import React, { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button type='button' className='border px-2 hover:bg-gray-100' onClick={() => setCount((count) => count + 1)}>
      Counter
      {' '}
      {count}
    </button>
  )
}
