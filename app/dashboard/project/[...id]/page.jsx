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
import Projectnavbar from '@/components/custom/project/project-navbar';

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
      <Projectnavbar projectInfo={projectInfo} setTimeRange={setTimeRange} timeRange={timeRange}/>
      {/* Content area */}
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
};

export default ProjectDashboard;