'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Briefcase } from "lucide-react";
import { useRouter } from 'next/navigation';
import { MdNavigateNext } from "react-icons/md";

const ProjectCard = ({ project }) => {
  const router = useRouter();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const diff = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const redirectToProject = () => {
    router.push(`/dashboard/project/${project.id}`);
  };

  return (
    <Card
      onClick={redirectToProject}
      className="relative group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
    >
      <div className="relative p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm flex items-center justify-center w-10 h-10">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <Briefcase className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 flex items-center gap-2">
                {project.name}
                <MdNavigateNext className="hidden group-hover:inline-block" size={20} />
              </h3>
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(project?.updatedAt)}
              </p>
            </div>
          </div>
          <BsThreeDotsVertical className="text-gray-400 hover:text-gray-600 transition-all" size={20} />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
