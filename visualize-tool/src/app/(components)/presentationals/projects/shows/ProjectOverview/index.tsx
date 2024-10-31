"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBalanceScale, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

type ProjectOverviewProps = {
    project: ProjectInfo
};

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
    project
}) => {
    return (
        <div className="text-center pb-2">
            <h1 className="text-3xl font-bold mb-4">{project.Name}</h1>

            {project.Section && (
                <span className="text-sm text-green-600 bg-green-100 rounded-full px-3 py-1 mr-2 inline-block">
                    {project.Section}
                </span>
            )}

            <div className="flex flex-wrap justify-around items-start mt-4">
                <div className="w-full md:w-1/3">
                    <h2 className="font-semibold mb-3 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Maintainers
                    </h2>
                    {Object.keys(project.Maintainers).map((key) => (
                        <div key={key} className="mb-2">
                            <p>{project.Maintainers[key].Name}</p>
                            <p className="text-sm text-gray-500">{project.Maintainers[key].Email}</p>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/3">
                    <h2 className="font-semibold mb-3 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
                        License
                    </h2>
                    {project.License === '' ? (
                        <div className="text-gray-500">
                            No License
                        </div>
                    ) : (
                        <p>{project.License}</p>
                    )}
                </div>

                <div className="w-full md:w-1/3">
                    <h2 className="font-semibold mb-3">
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                        URL
                    </h2>
                    {project.URL ? (
                        Object.keys(project.URL).map((key) => {
                            const label = key.includes('Vcs-') ? key.replace('Vcs-', '').trim() : key;
                            return (
                                <a
                                    href={project.URL[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline block mb-1"
                                    key={label}
                                >
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                    {label}
                                </a>
                            );
                        })
                    ) : (
                        <div className="text-gray-500">
                            No URLs
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ProjectOverview;