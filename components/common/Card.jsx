import React from 'react'

function Card({children}) {
  return (
    <div className='card rounded-md   dark:bg-slate-800   shadow-base h-full bg-white'>
      {children}
    </div>
  )
}

export default Card