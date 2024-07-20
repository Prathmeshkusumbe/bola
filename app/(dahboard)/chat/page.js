'use client'
import SearchMembers from '@/components/Chat/SearchMembers'
import Card from '@/components/common/Card'
import React from 'react'

function page() {
  return (
    <>
      <div className='flex h-full space-x-5'>
        <div className='flex-none w-[285px]'>
          <Card>
            <SearchMembers />
          </Card>
        </div>
        <div className='flex-1'>
          <div className='flex h-full space-x-5'>
            <div className='flex-1'><Card>second columns</Card></div>
            <div className='flex-none w-[285px]'><Card>second columns second columns</Card></div>
          </div>
        </div>
      </div>
    </>

  )
}

export default page