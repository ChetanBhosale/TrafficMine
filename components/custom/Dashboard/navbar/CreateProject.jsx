'use client'

import React, { useState } from 'react'
import CreateProjectModel from './CreateProjectModel'

const CreateProject = () => {
  const [isOpen, setOpen] = useState(false)

  return (
    <div onClick={() => setOpen(!isOpen)} className="flex cursor-pointer items-center justify-center relative px-8 py-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl 
          before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-r before:from-blue-500 before:to-purple-600 before:blur-md before:opacity-50 
          hover:before:opacity-100 focus:outline-none">
     
        CREATE PROJECT

      <CreateProjectModel isOpen={isOpen} setOpen={setOpen} />
    </div>
  )
}

export default CreateProject
