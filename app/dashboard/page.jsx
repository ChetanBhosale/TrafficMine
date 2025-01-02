'use client'

import SubBar from '@/components/custom/Dashboard/navbar/subBar';
import ProjectCard from '@/components/custom/project/projectcard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getProjects as fetchProjects } from '../actions/projects';
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-lg p-4 space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="flex justify-end gap-2 mt-4">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 w-6 rounded" />
    </div>
  </div>
);

const Dashboard = () => {
  const { data: sessionData, status } = useSession(); 
  const [projects, setProjects] = useState([]);

  const fetchUserProjects = async () => {
    if (sessionData?.user?.id) {
      try {
        const userProjects = await fetchProjects(sessionData.user.id);
        setProjects(userProjects || []); 
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); 
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserProjects();
    }
  }, [status, sessionData?.user?.id]);

  const refreshProjects = () => {
    fetchUserProjects();
  };

  if (status === 'unauthenticated') {
    return <div>Please sign in to view dashboard</div>; 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SubBar 
        user={sessionData?.user} 
        onProjectCreated={refreshProjects} 
      />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-5 w-full'>
        {status === 'loading' && Array(4).fill(null).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
        {projects.map((project, index) => (
          <ProjectCard project={project} key={project.id || index} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;