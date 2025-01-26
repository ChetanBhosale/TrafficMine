import React from 'react'
import { Skeleton } from '@/components/ui/skeleton' // Import the Skeleton component from shadcn

const InfoProjectSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 mt-20">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-16 h-16 rounded-full bg-gray-800" /> {/* Avatar Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded bg-gray-800" /> {/* Title Skeleton */}
          <Skeleton className="h-4 w-32 rounded bg-gray-800" /> {/* Subtitle Skeleton */}
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-64 rounded bg-gray-800" /> {/* Description Line 1 */}
        <Skeleton className="h-4 w-48 rounded bg-gray-800" /> {/* Description Line 2 */}
      </div>

      {/* Full-Width Line Chart Skeleton */}
      <Skeleton className="w-full h-[400px] rounded-lg bg-gray-800" /> {/* Line Chart Skeleton */}
    </div>
  )
}

export default InfoProjectSkeleton