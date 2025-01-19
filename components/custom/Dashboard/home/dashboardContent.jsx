
import CreateProject from '@/components/custom/Dashboard/navbar/CreateProject'
import {  FolderGit2 } from 'lucide-react'
import { StatsCard } from '@/components/custom/Dashboard/home/statas-card'
import ProjectCard from '@/components/custom/project/projectcard'
import { getProjects } from '@/app/actions/projects'
import CreateProjectModel from '../navbar/CreateProjectModel'

async function DashboardContent({ userId }) {
    const data = await getProjects(userId)
  
    if (!data || data.length === 0) {
      return (
        <div className="text-center mt-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
            <FolderGit2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No projects found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first project and begin tracking your progress!
          </p>
        <CreateProject />
        </div>
      )
    }
  
    const activeProjects = data.filter(project => project.status === 'active').length
    const completedProjects = data.filter(project => project.status === 'completed').length
  
    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            iconName="FolderGit2"
            label="Total Projects"
            value={data.length}
            gradient="bg-gradient-to-br from-purple-600 to-indigo-600"
          />
          <StatsCard
            iconName="Activity"
            label="Active Projects"
            value={activeProjects}
            gradient="bg-gradient-to-br from-green-600 to-emerald-600"
          />
          <StatsCard
            iconName="CheckCircle"
            label="Completed Projects"
            value={completedProjects}
            gradient="bg-gradient-to-br from-blue-600 to-cyan-600"
          />
          <CreateProject />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              image={project.image}
              status={project.status}
            />
          ))}
        </div>
      </>
    )
  }


  export default DashboardContent