'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { LuSun, LuMoon } from "react-icons/lu";
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaMoon } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const navigate = useRouter()
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/30 dark:bg-black/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl text-gray-800 dark:text-white">TrafficMine</h1>
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9" /> {/* Placeholder for theme toggle */}
          </div>
        </div>
      </header>
    );
  }

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/30 dark:bg-black/30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl text-gray-800 dark:text-white">TrafficMine</h1>
        <div className="flex items-center space-x-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? (
            <LuSun className="w-5 h-5 text-white" /> // Sun icon for light theme
          ) : (
            <FaMoon className="w-5 h-5 text-gray-800 dark:text-gray-200" /> // Moon icon for dark theme
          )}
        </button>

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={session.user.image || ''} 
                      alt={session.user.name || 'User avatar'} 
                    />
                    <AvatarFallback>
                      {getInitials(session.user.name || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;