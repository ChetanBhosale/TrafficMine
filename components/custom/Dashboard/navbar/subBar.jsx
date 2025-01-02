'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import CreateProject from '../CreateProject'

const SubBar = ({user, onProjectCreated}) => {
  const [open,setOpen] = useState(false)
  return (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white shadow-sm">
            <div >
              <h1 className="font-semibold uppercase text-2xl">
                Welcome back, {user?.name}
              </h1>
              <p className="text-[#5D4037]">
                Here's what's happening with your projects today.
              </p>
            </div>
          <CreateProject setOpen={setOpen} open={open} onProjectCreated={onProjectCreated}>
            <Button variant="outline" className="hover:bg-header hover:text-white border-header">
              Create new project
            </Button>
          </CreateProject>
          </div>
  )
}

export default SubBar
