"use client";

import React from "react";

import ProjectsProvider from "../../containers/providers/ProjectsProvider";
import NoResultMessage from "../../presentationals/projects/NoResultMessage";
import ResultSummaryContainer from "../../containers/projects/ResultSummaryContainer";
import SearchResultContainer from "../../containers/projects/SearchResultContainer";
import PaginationContainer from "../../containers/projects/PaginationContainer";

const Projects: React.FC = () => {
    return (
        <div className="container mx-auto py-10 px-10">
            <ProjectsProvider>
                {(result, currentPage, setCurrentPage, totalProjects) => (
                    <>
                        {result.length === 0 ? (
                            // 検索結果がなかった時のページ
                            <NoResultMessage />
                        ) : (
                            <>
                                <ResultSummaryContainer
                                    currentPage={currentPage}
                                    totalProjects={totalProjects}
                                />
                                <PaginationContainer
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalProjects={totalProjects}
                                />
                                <SearchResultContainer result={result} />
                                <PaginationContainer
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalProjects={totalProjects}
                                />
                            </>
                        )}
                            </>
                )}
            </ProjectsProvider>
        </div>
    )
};

export default Projects;