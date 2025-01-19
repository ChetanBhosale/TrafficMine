import React from 'react'

const InfoProjectSkeleton = () => {
  return (

    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
      </div>
    </div>

  )
}

export default InfoProjectSkeleton