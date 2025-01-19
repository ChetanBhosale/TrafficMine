import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth_config'
import DashboardSkeleton from '@/components/custom/Dashboard/home/DashContentSkeleton'
import DashboardContent from '@/components/custom/Dashboard/home/dashboardContent'




export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen pt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your projects and track your progress
          </p>
        </div>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent userId={session.user?.id} />
        </Suspense>
      </div>
    </div>
  )
}

