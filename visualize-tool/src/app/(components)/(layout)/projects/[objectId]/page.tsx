"use client";

import React from "react";

import SelectedProjectProvider from "@/app/(components)/containers/providers/SelectedProjectProvider";
import ProjectOverviewContainer from "@/app/(components)/containers/projects/shows/ProjectOverviewContainer";
import LanguageInfoContainer from "@/app/(components)/containers/projects/shows/LanguageInfoContainer";
import DependencyInfoContainer from "@/app/(components)/containers/projects/shows/DependencyInfoContainer";
import PackageInfoContainer from "@/app/(components)/containers/projects/shows/PackageInfoContainer";
import SimilarProjectsContainer from "@/app/(components)/containers/projects/shows/SimilarProjectsContainer";
import CommitStatsContainer from "@/app/(components)/containers/projects/shows/CommitStatsContainer";
import ContributionContainer from "@/app/(components)/containers/projects/shows/ContributionContainer";

const ProjectShow: React.FC = () => {
    return (
        <SelectedProjectProvider >
            {(project, transitiveProjects) => (
                <div className="container mx-auto py-10 px-10">
                    {project === null ? (
                        // TODO: null表示
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
                            <div className="flex flex-wrap pb-2">
                                <div className="w-full md:w-1/2 pr-4">
                                    <CommitStatsContainer
                                        projectName={project.Name}
                                        url={
                                            project.URL['Vcs-Browser'] ?
                                            project.URL['Vcs-Browser'] :
                                            undefined
                                        }
                                    />
                                </div>
                                <div className="w-full md:w-1/2 pl-4">
                                    <ContributionContainer
                                        url={
                                            project.URL['Vcs-Browser'] ?
                                            project.URL['Vcs-Browser'] :
                                            undefined
                                        }
                                    />
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