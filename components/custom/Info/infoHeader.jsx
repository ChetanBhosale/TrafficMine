import React, { Suspense } from 'react'
import InfoProjectSkeleton from './InfoProjectSkeleton'
import { Button } from '@/components/ui/button'
import ProjectScript from '../project/ProjectScript'



const InfoHeader = ({projectInfo}) => {

  return (
    <div className="w-full flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          {projectInfo ? (
            <>
              <img
                onError={(e) => (e.target.src = 'https://png.pngtree.com/png-clipart/20190405/ourmid/pngtree-letter-t-3d-company-logo-design-png-image_901883.jpg')}
                src={projectInfo?.image || '/placeholder-image.jpg'}
                alt={projectInfo?.name}
                className="w-16 h-16 rounded-full object-cover shadow-lg border border-gray-300 dark:border-gray-600"
              />
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {projectInfo?.name || 'Project Name'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Project ID : {projectInfo?.id}
                </p>
                <p className="text-sm">
                  <a
                    href={projectInfo?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {projectInfo?.link}
                  </a>
                </p>
              </div>
            </>
          ) : (
            <InfoProjectSkeleton />
          )}
        </div>
        <Suspense fallback={<Button disabled>Loading...</Button>}>
          <ProjectScript project={projectInfo}>
            <Button
              disabled={!projectInfo}
              className="text-white px-4 py-2 "
            >
              Integrate Script
            </Button>
          </ProjectScript>
        </Suspense>
      </div>
  )
}

export default InfoHeader