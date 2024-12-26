"use client";

import React from 'react';
import Link from 'next/link';

import { ProjectInfo } from '@/app/types/ProjectInfo';

type ProjectCardProps = {
  project: ProjectInfo;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div className="flex border rounded-lg p-5 mb-6 shadow-lg">
            <div className="w-4/5 ml-2">
                <h2 className="text-xl font-bold mb-2">
                    <Link href={`/projects/${project._id}`} className="text-blue-500 hover:underline">
                        {project.Name}
                    </Link>
                </h2>
                <div className="text-gray-700 mb-4">
                    <div className="ml-2">
                        {project.Description.summary}
                    </div>
                </div>
            </div>

            <div className="w-1/5 flex flex-col justify-center">
                {project.Section && <span className="mb-1"><strong>Section:</strong> {project.Section}</span>}
                <span className="mb-1"><strong>Language:</strong> {project.Language.Lang1.Name}</span>
                <span><strong>License:</strong> {project.License}</span>
            </div>
        </div>
    );
};

export default ProjectCard;
