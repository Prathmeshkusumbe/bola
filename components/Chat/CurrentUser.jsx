import { isNullUndefinedOrEmpty, isObjectValid } from '@/helper/generalHelper';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function CurrentUser() {
  const currUser = useSelector((state)=> state.auth.decodedToken);
  // useEffect(()=>{
  //   console.log(currUser);
  // }, [currUser])
  return (
    <div className='px-6 pt-6 border-b border-slate-100 dark:border-slate-700 pb-4'>
      {!isNullUndefinedOrEmpty(currUser) &&
        <div>
          <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]">{currUser.username}
            {/* <span className="status bg-success-500 inline-block h-[10px] w-[10px] rounded-full ml-3"></span> */}
          </span>
        </div>
      }
    </div>
  )
}
