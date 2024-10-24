"use client";

import React from "react";

import ProjectsProvider from "../../containers/providers/ProjectsProvider";
import ResultSummaryContainer from "../../containers/projects/ResultSummaryContainer";
import PaginationContainer from "../../containers/projects/PaginationContainer";

const Projects: React.FC = () => {
    return (
        <ProjectsProvider>
            {(result, currentPage, setCurrentPage, totalProjects, applyFiltersAndSort) => (
                <div className="container mx-auto py-10 px-10">
                    <>
                        <ResultSummaryContainer
                            result={result}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalProjects={totalProjects}
                            applyFiltersAndSort={applyFiltersAndSort}
                        />
                        <PaginationContainer
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalProjects={totalProjects}
                        />
                    </>
                </div>
            )}
        </ProjectsProvider>
    )
};

export default Projects;