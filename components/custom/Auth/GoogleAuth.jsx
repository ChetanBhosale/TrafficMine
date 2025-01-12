'use client'

import React from 'react'
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import {cn} from "@/lib/utils";
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdNavigateNext } from "react-icons/md";

const GoogleAuth = () => {
    
let data = useSession()

const router = useRouter()

function handleButtonClicked(){
    if(data?.status === "authenticated"){
        router.push('/dashboard')
    }else{
        handleGoogleAuth()
    }
}


function handleGoogleAuth() {
    signIn('google')
  }

  return (
     <div className="z-10 mt-6"  onClick={() => handleButtonClicked()}>
            <AnimatedGradientText className="cursor-pointer group py-3 px-8">
            {/* 🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "} */}
            {
                data?.status === "authenticated" ? (
                    <div className='flex items-center justify-center'>
                    <span
                        className={cn(
                            ` animate-gradient ml-3 inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-xl text-transparent`,
                        )}
                    >
                        Dashboard
                    </span>
                    <MdNavigateNext className='group-hover:ml-2 transition-all duration-200 text-[#9c40ff] ml-0 mr-0' size={30} />
                    </div>
                ) : (
                    <>
                    <span
                        className={cn(
                            ` animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-lg text-transparent`,
                        )}
                    >
                        Start today with
                    </span>
                     <FcGoogle className="h-6 w-6 ml-2" />
                     </>
                )
            }
          </AnimatedGradientText>
          </div>
  )
}

export default GoogleAuth