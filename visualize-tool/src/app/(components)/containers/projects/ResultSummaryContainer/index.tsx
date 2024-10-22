"use client";

import React from "react";

import { projectsPerPage } from "@/app/(components)/containers/providers/ProjectsProvider/config";
import ResultSummary from "@/app/(components)/presentationals/projects/ResultSummary";

type ResultSummaryContainerProps = {
    currentPage: number;
    totalProjects: number;
};

const ResultSummaryContainer: React.FC<ResultSummaryContainerProps> = ({
    currentPage,
    totalProjects
}) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    return (
        <ResultSummary  currentPage={currentPage} totalProjects={totalProjects} totalPages={totalPages} />
    )
};

export default ResultSummaryContainer;