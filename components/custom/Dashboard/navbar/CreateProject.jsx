'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreateProjectModel from './CreateProjectModel'

const CreateProject = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="mx-auto px-4">
      <div className="flex items-center space-x-3 w-full h-14">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 h-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem>
                Name (Z-A)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={() => setOpen(true)} className="whitespace-nowrap dark:text-white">
          Create Project
        </Button>
      </div>
      
      <CreateProjectModel isOpen={isOpen} setOpen={setOpen} />
    </div>
  )
}

export default CreateProject