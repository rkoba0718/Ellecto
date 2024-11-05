"use client";

import React from "react";

import SelectedProjectProvider from "@/app/(components)/containers/providers/SelectedProjectProvider";
import ProjectOverviewContainer from "@/app/(components)/containers/projects/shows/ProjectOverviewContainer";
import LanguageInfoContainer from "@/app/(components)/containers/projects/shows/LanguageInfoContainer";
import DependencyInfoContainer from "@/app/(components)/containers/projects/shows/DependencyInfoContainer";
import PackageInfoContainer from "@/app/(components)/containers/projects/shows/PackageInfoContainer";
import SimilarProjectsContainer from "@/app/(components)/containers/projects/shows/SimilarProjectsContainer";

// TODO: component UI
const CommitStats = () => <div className="mb-8">Commit Statistics</div>;
const DownloadStats = () => <div className="mb-8">Download Statistics</div>;
const CommunityInfo = () => <div className="mb-8">Community Information</div>;

const ProjectShow: React.FC = () => {
    return (
        <SelectedProjectProvider >
            {(project, transitiveProjects) => (
                <div className="container mx-auto py-10 px-10">
                    {project === null ? (
                        <div>Failed to load project data.</div>
                    ) : (
                        <>
                            <ProjectOverviewContainer project={project} />
                            <div className="flex flex-wrap pb-2">
                                <div className="w-full md:w-1/2 px-4">
                                    <LanguageInfoContainer language={project.Language} loc={project.LOC} />
                                </div>
                                <div className="w-full md:w-1/2 px-4">
                                    <DependencyInfoContainer
                                        selectedProjectName={project.Name}
                                        dependencies={
                                            project['Build-Depends'] ?
                                            project['Build-Depends'] :
                                            undefined
                                        }
                                        transitiveDependencies={transitiveProjects}
                                    />
                                </div>
                            </div>
                            <PackageInfoContainer packageData={project.Package} />
                            <SimilarProjectsContainer packageName={project.Name} />

                            {/* Commit, Download, and Community Information */}
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/3 pr-4">
                                    <CommitStats />
                                </div>
                                <div className="w-full md:w-1/3 px-2">
                                    <DownloadStats />
                                </div>
                                <div className="w-full md:w-1/3 pl-4">
                                    <CommunityInfo />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </SelectedProjectProvider>
    )
};

export default ProjectShow;