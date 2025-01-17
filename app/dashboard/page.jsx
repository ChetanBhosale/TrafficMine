import CreateProject from '@/components/custom/Dashboard/navbar/CreateProject'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth_config'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { getProjects } from '../actions/projects'
import Link, { NextLink } from 'next/link'

const DashboardPage =  async() => {

  const session = await getServerSession(authOptions)
  if(!session){
    redirect('/')
  }

  let data = await getProjects(session?.user?.id)

  console.log(data)
  
  return (
    <div className='mt-14 min-h-screen'>
      <div className="container mx-auto px-4 py-4">
        <CreateProject />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {data?.map((project) => (
            <div
              key={project.id}
              className="group relative bg-white dark:bg-black dark:text-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Card Content */}
              <div className="p-6 flex gap-2">
                <img className="w-16 h-16 object-cover rounded-full "  src={project?.image} alt={project.name} />
                <div className="p-4">
                <h2 className="text-xl font-semibold  mb-2">{project.name}</h2>
                <p className="text-sm  mb-4">
                  {project.description || 'No description available'}
                </p>
                <Link
                  href={`/dashboard/project/${project.id}`}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Visit Project
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
                </div>
                
              </div>

              {/* Gradient Hover Effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage