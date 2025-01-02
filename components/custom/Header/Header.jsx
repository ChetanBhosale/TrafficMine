'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import React from 'react'
import Userdropdown from './Userdropdown'

const Headers = () => {
  const data = useSession()

  return (
    <div className='w-full py-6 flex items-center justify-between'>
        <h1 className=''>TrafficMine</h1>
        <div className='flex items-center justify-center gap-6'>

        <div className='space-x-3'>
            <a href='#' className=''>Home</a>
            <a href='#' className=''>About</a>
            <a href='#' className=''>Pricing</a>
        </div>
        {
          data?.status === "authenticated" && (
            <Userdropdown data={data} />
          )
        }
        </div>
    </div>
  )
}

export default Headers