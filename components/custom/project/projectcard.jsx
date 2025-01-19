import {Activity, CheckCircle} from 'lucide-react'

function ProjectCard({ id, name, description, image, status }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full animate-pulse group-hover:animate-none" /> */}
            <img 
              className="relative w-16 h-16 rounded-full border-2 object-cover" 
              src={image || "/placeholder.svg"} 
              alt={name} 
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {name}
            </h3>
            {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2
              ${status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : status === 'completed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
              {status}
            </span> */}
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <a
            href={`/dashboard/project/${id}`}
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Visit Project
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          
          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Activity className="w-4 h-4 mr-1" />
            Active
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
    </div>
  )
}

export default ProjectCard