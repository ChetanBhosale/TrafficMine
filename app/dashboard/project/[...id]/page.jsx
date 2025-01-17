'use client'

import { getSingleProject } from '@/app/actions/projects'
import ProjectScript from '@/components/custom/project/ProjectScript'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const ProjectPage = () => {
  const session = useSession()
  const router = useRouter()
  const getParams = useParams()
  const [projectInfo, setProjectInfo] = useState(null)

  async function fetchProjectData(projectId, userId) {
    const data = await getSingleProject(projectId, userId)
    if (data?.status === 200) {
      setProjectInfo(data?.data)
    } else {
      toast.error('Project not found')
      router.push('/dashboard')
    }
  }

  useEffect(() => {
    if (session?.status === 'unauthenticated') {
      router.push('/')
    }
    if (session?.status === 'authenticated') {
      fetchProjectData(getParams.id[0], session?.data?.user?.id)
    }
  }, [session])

  if(session?.status == "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="mt-16 px-4">
      {/* Page Header */}
      <div className="w-full flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {projectInfo ? (<>
            <img
            onError={(e) => (e.target.src = 'https://png.pngtree.com/png-clipart/20190405/ourmid/pngtree-letter-t-3d-company-logo-design-png-image_901883.jpg')}
            src={projectInfo?.image || '/placeholder-image.jpg'}
            alt={projectInfo?.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {projectInfo?.name || 'Project Name'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Project ID : {projectInfo?.id}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <a href={projectInfo?.link} target="_blank" rel="noopener noreferrer">{projectInfo?.link} </a>
            </p>
            
            
          </div></>): <div>Loading....</div>}
          
        </div>
        <ProjectScript project={projectInfo}>
        <Button disabled={!projectInfo} className="dark:text-white">Integrate Script</Button>
        </ProjectScript>
      </div>

      {/* Project Details Section */}
      <div className="mt-6">
        {projectInfo ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Project Details
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>
                <strong>Link: </strong>
                <a
                  href={projectInfo?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  {projectInfo?.link || 'No link available'}
                </a>
              </li>
              <li>
                <strong>Created At: </strong>
                {projectInfo?.createdAt
                  ? new Date(projectInfo.createdAt).toLocaleDateString()
                  : 'N/A'}
              </li>
              <li>
                <strong>Status: </strong>
                {projectInfo?.status || 'Unknown'}
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-400">
            Loading project information...
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectPage
