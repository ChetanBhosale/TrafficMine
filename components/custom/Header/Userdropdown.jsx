import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Userdropdown = ({data}) => {
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const location = usePathname()
  console.log(location)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='cursor-pointer flex items-center gap-2'>
          <Avatar className='w-8 h-8 rounded-full'>
            <AvatarFallback>U</AvatarFallback>
            <AvatarImage src={data?.data?.user?.image} />
          </Avatar>
          {
          location.split('/').includes('dashboard') && (
            <div className='text-sm hover:underline'>{data?.data?.user?.name}</div>
          )
        }
        </div>
        

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Userdropdown
