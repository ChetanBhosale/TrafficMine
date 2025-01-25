import React, { Suspense } from 'react';
import InfoProjectSkeleton from './InfoProjectSkeleton';
import { Button } from '@/components/ui/button';
import ProjectScript from '../project/ProjectScript';

const InfoHeader = ({ projectInfo }) => {
  return (
    <div className="w-full flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="flex items-center gap-6">
        {projectInfo ? (
          <>
            <div className="relative group">
              <img
                onError={(e) => (e.target.src = 'https://png.pngtree.com/png-clipart/20190405/ourmid/pngtree-letter-t-3d-company-logo-design-png-image_901883.jpg')}
                src={projectInfo?.image || '/placeholder-image.jpg'}
                alt={projectInfo?.name}
                className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300">
                {projectInfo?.name || 'Project Name'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Project ID: <span className="font-mono text-gray-700 dark:text-gray-300">{projectInfo?.id}</span>
              </p>
              <p className="text-sm">
                <a
                  href={projectInfo?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  {projectInfo?.link}
                </a>
              </p>
            </div>
          </>
        ) : (
          <InfoProjectSkeleton />
        )}
      </div>
      <Suspense fallback={<Button disabled className="opacity-50">Loading...</Button>}>
        <ProjectScript project={projectInfo}>
          <Button
            disabled={!projectInfo}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Integrate Script
          </Button>
        </ProjectScript>
      </Suspense>
    </div>
  );
};

export default InfoHeader;