"use client";

import React from "react";

import Loading from "@/app/(components)/common/presentationals/Loading";
import Error from "@/app/(components)/common/presentationals/Error";
import NoData from "@/app/(components)/common/presentationals/NoData";
import SelectedProjectProvider from "@/app/(components)/containers/providers/SelectedProjectProvider";
import ProjectTitleContainer from "@/app/(components)/containers/projects/shows/ProjectTitleContainer";
import ProjectPopularContainer from "@/app/(components)/containers/projects/shows/ProjectPopularContainer";
import ProjectOverviewContainer from "@/app/(components)/containers/projects/shows/ProjectOverviewContainer";
import ProjectDescriptionContainer from "@/app/(components)/containers/projects/shows/ProjectDescriptionContainer";
import LanguageInfoContainer from "@/app/(components)/containers/projects/shows/LanguageInfoContainer";
import DependencyContainer from "@/app/(components)/common/containers/dependency/DependencyContainer";
import PackageInfoContainer from "@/app/(components)/containers/projects/shows/PackageInfoContainer";
import SimilarProjectsContainer from "@/app/(components)/containers/projects/shows/SimilarProjectsContainer";
import CommitStatsContainer from "@/app/(components)/containers/projects/shows/CommitStatsContainer";
import ContributionContainer from "@/app/(components)/containers/projects/shows/ContributionContainer";

const ProjectShow: React.FC = () => {
    return (
        <SelectedProjectProvider >
            {(loading, error, project) => (
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
                                <div className="lg:relative flex flex-col lg:flex-row items-center lg:justify-center">
                                    <ProjectTitleContainer project={project} />
                                    <div className="lg:absolute lg:right-0 flex lg:flex-row gap-2">
                                        <ProjectPopularContainer
                                            url={
                                                project.APIURL ?
                                                project.APIURL :
                                                undefined
                                            }
                                        />
                                    </div>
                                </div>
                                <ProjectOverviewContainer project={project} />
                                <div className="flex flex-wrap pb-2">
                                    <div className="w-full md:w-2/5 px-4">
                                        <LanguageInfoContainer language={project.Language} loc={project.LOC} />
                                    </div>
                                    <div className="w-full md:w-3/5 px-4">
                                        <ProjectDescriptionContainer
                                            description={project.Description}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap pb-2">
                                    <div className="w-full md:w-1/2 pr-8">
                                        <DependencyContainer
                                            kind="Run-time"
                                            selectedProjectName={project.Name}
                                            dependencies={
                                                project.Depends ?
                                                project.Depends :
                                                undefined
                                            }
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 pl-8">
                                        <DependencyContainer
                                            kind="Build"
                                            selectedProjectName={project.Name}
                                            dependencies={
                                                project['Build-Depends'] ?
                                                project['Build-Depends'] :
                                                undefined
                                            }
                                        />
                                    </div>
                                </div>
                                <PackageInfoContainer packageData={project.Package} />
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
                                <SimilarProjectsContainer packageName={project.Name} />
                            </>
                        )
                    )}
                </div>
            )}
        </SelectedProjectProvider>
    )
};

export default ProjectShow;