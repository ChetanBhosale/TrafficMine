

import CreateProject from '@/components/custom/Dashboard/navbar/CreateProject'
import { authOptions } from '@/lib/auth_config'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardLayout = async({children}) => {
  let session =  await getServerSession(authOptions)
  if(!session){
    redirect('/')
  }
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}

export default DashboardLayout