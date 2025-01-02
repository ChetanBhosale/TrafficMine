import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { ChevronDown, Code2, ExternalLink } from 'lucide-react'
import React from 'react'
import ProjectScript from './ProjectScript'

const Projectnavbar = ({projectInfo, setTimeRange,timeRange}) => {
  return (
    <div className="border-b bg-white">
        <div className="w-full max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-3 group">
                {projectInfo?.image ? (
                  <img 
                    src={projectInfo.image} 
                    alt={projectInfo?.name} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-sm">
                    <ExternalLink size={20} className="text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-gray-900">{projectInfo?.name}</span>
                  {projectInfo?.url && (
                    <a 
                      href={projectInfo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500  flex items-center gap-1 transition-opacity"
                    >
                      {projectInfo.url.replace(/(^\w+:|^)\/\//, '')}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-2 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="font-normal hover:bg-gray-50 text-gray-600"
                    >
                      {timeRange}
                      <ChevronDown size={16} className="ml-2 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px]">
                    <DropdownMenuItem onClick={() => setTimeRange("Last 24 Hours")}>
                      Last 24 Hours
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange("Last 7 Days")}>
                      Last 7 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange("Last 30 Days")}>
                      Last 30 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange("Last 90 Days")}>
                      Last 90 Days
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
        <ProjectScript project={projectInfo}>

       
            <Button 
            >
              <Code2 size={16} className="mr-2" />
              Script
            </Button>
            </ProjectScript>
          </div>
        </div>
      </div>
  )
}

export default Projectnavbar