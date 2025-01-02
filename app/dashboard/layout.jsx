import { authOptions } from '@/lib/auth_config'
import { getServerSession } from 'next-auth'
import React from 'react'
import {redirect} from 'next/navigation'
import DashboardNavbar from '@/components/custom/Dashboard/navbar/navbar'

const DashboardLayout = async ({children}) => {
  const data = await getServerSession(authOptions)
  if(data?.user == undefined || !data){
    redirect('/')
  }
  
  return (
    <div className='bg-gray-50 min-h-screen'>
      <DashboardNavbar />
      <div className="">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout

