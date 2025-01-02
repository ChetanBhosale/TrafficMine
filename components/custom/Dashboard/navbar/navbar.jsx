'use client'

import React from 'react'
import Userdropdown from '../../Header/Userdropdown'
import { useSession } from 'next-auth/react'
import { MoonIcon, SunIcon, BellIcon, SearchIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

const DashboardNavbar = () => {
    const data = useSession()
    const { setTheme, theme } = useTheme()

    return (
      <div className='py-4 px-6 flex sticky top-0 items-center justify-between shadow-sm bg-white/80 backdrop-blur-sm shadow-lg'>
          <Link href="/dashboard" className='text-lg text-header'>TrafficMine</Link>
          <div className='flex items-center space-x-4'>
            {/* <div className="relative hidden md:block">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#795548]" />
              <Input
                className="pl-8 w-[300px] bg-[#F5F5F7] border-none text-[#5D4037]"
                type="search"
                placeholder="Search..."
              />
            </div> */}
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5 text-[#3E2723]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#3E2723]" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#3E2723]" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Userdropdown data={data} />
          </div>
      </div>
    )
}

export default DashboardNavbar

