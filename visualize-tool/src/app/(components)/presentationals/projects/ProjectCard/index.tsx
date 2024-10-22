"use client";

import React from 'react';

import { ProjectInfo } from '@/app/types/ProjectInfo';

type ProjectCardProps = {
  project: ProjectInfo;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div className="flex border rounded-lg p-4 mb-6 shadow-lg">
            <div className="w-4/5">
                <h2 className="text-xl font-bold mb-2">
                    <a href={`/projects/${project._id}`} className="text-blue-500 hover:underline">
                        {project.Name}
                    </a>
                </h2>
                <p className="text-gray-700 mb-4">
                    {project.Description.summary}
                </p>
            </div>

            <div className="w-1/5 flex flex-col justify-between">
                {project.Section && <p><strong>Section:</strong> {project.Section}</p>}
                {project.Version['Standards-Version'] && <p><strong>Version:</strong> {project.Version['Standards-Version']}</p>}
                <p><strong>License:</strong> {project.License}</p>
            </div>
        </div>
    );
};

export default ProjectCard;
