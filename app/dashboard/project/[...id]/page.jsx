'use client'

import { getSingleProject } from '@/app/actions/projects'
import InfoHeader from '@/components/custom/Info/infoHeader'
import InfoProjectSkeleton from '@/components/custom/Info/InfoProjectSkeleton'
import ProjectScript from '@/components/custom/project/ProjectScript'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
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

  if (session?.status === "loading") {
    return <InfoProjectSkeleton />
  }

  return (
    <div className="mt-16  ">
      {/* Page Header */}
        <InfoHeader projectInfo={projectInfo} />
      {/* Project Details Section */}
     
    </div>
  )
}

export default ProjectPage
