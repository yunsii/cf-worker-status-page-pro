import React from 'react'

import { Counter } from '#src/components/Counter'

export default function Page() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive.
          {' '}
          <Counter />
        </li>
      </ul>
    </>
  )
}
