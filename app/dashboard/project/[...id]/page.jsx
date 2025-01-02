'use client'
import { getSingleProject } from '@/app/actions/projects';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Code2, ExternalLink, Clock } from 'lucide-react';

const ProjectDashboard = () => {
  const { data, status } = useSession();
  const params = useParams();
  const router = useRouter()
  const [projectInfo, setProjects] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeRange, setTimeRange] = useState("Last 24 Hours");
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProjectData({ id }) {
    if (data?.user) {
      try {
        const res = await getSingleProject(id, data.user.id);
        if (res?.status === 200) {
          setProjects(res?.data);
        } else {
          setProjects(null);
          setErrorMessage('Project not found');
        }
      } catch (error) {
        setErrorMessage('Error fetching project data');
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjectData({ id: params['id'][0] });
    }
  }, [status, data?.user]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        <div className="text-red-500 font-medium">{errorMessage} </div>
        <Button className="mt-5" onClick={() => router.push('/dashboard')}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
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
            
            <Button 
            >
              <Code2 size={16} className="mr-2" />
              Script
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
};

export default ProjectDashboard;