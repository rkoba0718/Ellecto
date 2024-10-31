"use client";

import React from "react";

import SelectedProjectProvider from "@/app/(components)/containers/providers/SelectedProjectProvider";
import ProjectOverviewContainer from "@/app/(components)/containers/projects/shows/ProjectOverviewContainer";
import LanguageInfoContainer from "@/app/(components)/containers/projects/shows/LanguageInfoContainer";

// TODO: component UI
const DependencyGraph = () => <div className="mb-8">Dependency Graph</div>;
const PackageInfo = () => <div className="mb-8">Package Information</div>;
const SimilarProjects = () => <div className="mb-8">Similar Projects</div>;
const CommitStats = () => <div className="mb-8">Commit Statistics</div>;
const DownloadStats = () => <div className="mb-8">Download Statistics</div>;
const CommunityInfo = () => <div className="mb-8">Community Information</div>;

const ProjectShow: React.FC = () => {
    return (
        <SelectedProjectProvider >
            {(project) => (
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
                                    <DependencyGraph />
                                </div>
                            </div>

                            {/* Package Information Section */}
                            <PackageInfo />

                            {/* Similar Projects Section */}
                            <SimilarProjects />

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