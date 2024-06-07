import React from 'react'
import { cls } from 'tagged-classnames-free'

export interface IEmptyProps {
  children?: React.ReactNode
}

const Empty: React.FC<IEmptyProps> = (props) => {
  const { children } = props
  return (
    <div className={cls`
      mt-4 flex min-h-40 items-center justify-center
      rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white
    `}
    >
      {children}
    </div>
  )
}

export default Empty
