"use client";

import React from "react";

import { projectsPerPage } from "../../containers/providers/ProjectsProvider/config";
import ProjectsProvider from "../../containers/providers/ProjectsProvider";
import ResultSummaryContainer from "../../containers/projects/ResultSummaryContainer";
import PaginationContainer from "../../common/containers/PaginationContainer";

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
                            projectsPerPage={projectsPerPage}
                        />
                    </>
                </div>
            )}
        </ProjectsProvider>
    )
};

export default Projects;