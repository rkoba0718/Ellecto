"use client";

import React from "react";

import Loading from "@/app/(components)/common/presentationals/Loading";
import Error from "@/app/(components)/common/presentationals/Error";
import NoData from "@/app/(components)/common/presentationals/NoData";
import SelectedProjectProvider from "@/app/(components)/containers/providers/SelectedProjectProvider";
import ProjectTitleContainer from "@/app/(components)/containers/projects/shows/ProjectTitleContainer";
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
            {(loading, error, project, transitiveProjects) => (
                <div className="container mx-auto py-10 px-10">
                    {loading ? (
                        <Loading />
                    ) : error ? (
                        <Error message={`${error.status} ${error.message}`} />
                    ) : (
                        project === null ? (
                            <NoData message="Failed to get project data" />
                        ) : (
                            <>
                                <ProjectTitleContainer project={project} />
                                <ProjectOverviewContainer project={project} />
                                <PackageInfoContainer packageData={project.Package} />
                                <div className="flex flex-wrap pb-2">
                                    <div className="w-full md:w-2/5 px-4">
                                        <LanguageInfoContainer language={project.Language} loc={project.LOC} />
                                    </div>
                                    <div className="w-full md:w-3/5 px-4">
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
                                <SimilarProjectsContainer packageName={project.Name} />
                                <div className="flex flex-wrap pb-2">
                                    <div className="w-full md:w-1/2 pr-4">
                                        <CommitStatsContainer
                                            projectName={project.Name}
                                            url={
                                                project.APIURL ?
                                                project.APIURL :
                                                undefined
                                            }
                                            firstCommitDate={
                                                project.FirstCommitDate !== null ?
                                                project.FirstCommitDate :
                                                ''
                                            }
                                            lastCommitDate={
                                                project.LastCommitDate !== null ?
                                                project.LastCommitDate :
                                                ''
                                            }
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 pl-4">
                                        <ContributionContainer
                                            url={
                                                project.APIURL ?
                                                project.APIURL :
                                                undefined
                                            }
                                        />
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>
            )}
        </SelectedProjectProvider>
    )
};

export default ProjectShow;