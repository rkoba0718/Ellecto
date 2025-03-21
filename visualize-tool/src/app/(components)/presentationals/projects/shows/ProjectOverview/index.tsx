"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBalanceScale, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import NoData from "@/app/(components)/common/presentationals/NoData";

type ProjectOverviewProps = {
    project: ProjectInfo
};

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
    project
}) => {
    return (
        <div className="text-center pb-2">
            <div className="flex flex-wrap justify-around items-start mt-4">
                <div className="w-full md:w-1/3">
                    <h2 className="font-bold text-xl mb-3 flex items-center justify-center">
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
                    <h2 className="font-bold text-xl mb-3 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
                        License
                    </h2>
                    {project.License === '' ? (
                        <NoData message="No License" />
                    ) : (
                        <a
                            href={`https://opensource.org/license/${project.License}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline block mb-1"
                        >
                            {project.License}
                        </a>
                    )}
                </div>

                <div className="w-full md:w-1/3">
                    <h2 className="font-bold text-xl mb-3">
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                        URL
                    </h2>
                    {project.URL ? (
                        <>
                            {Object.keys(project.URL).map((key) => {
                                const label = key.includes('Vcs-') ? key.replace('Vcs-', '').trim() : key;
                                // GitのcloneURLは表示しない
                                if (label === 'Git') return null;
                                return (
                                    <a
                                    href={project.URL[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline block mb-1"
                                    key={label}
                                    >
                                        <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                        {label === 'Browser' ? 'Repository' : label}
                                    </a>
                                );
                            })}
                            {project.URL['Vcs-Git'] && (
                                <div className="mt-6 mx-8">
                                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto text-gray-600">
                                        git clone {project.URL['Vcs-Git']}
                                    </pre>
                                </div>
                            )}
                        </>
                    ) : (
                        <NoData message="No URLs" />
                    )}
                </div>
            </div>
        </div>
    )
};

export default ProjectOverview;