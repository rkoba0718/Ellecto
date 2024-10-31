"use client";

import React, { useState } from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import { projectsPerPage } from "@/app/(components)/containers/providers/ProjectsProvider/config";
import ResultSummary from "@/app/(components)/presentationals/projects/ResultSummary";
import PaginationContainer from "../../../common/containers/PaginationContainer";
import SearchResultContainer from "../SearchResultContainer";

type ResultSummaryContainerProps = {
    result: ProjectInfo[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalProjects: number;
    applyFiltersAndSort: (filters: { license: string; language: string }, sort: string) => void;
};

const ResultSummaryContainer: React.FC<ResultSummaryContainerProps> = ({
    result,
    currentPage,
    setCurrentPage,
    totalProjects,
    applyFiltersAndSort
}) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const [sort, setSort] = useState('relevance');
    const [filters, setFilters] = useState({ license: '', language: '' });

    const handleSortChange = (sortValue: string) => {
        setSort(sortValue);
        applyFiltersAndSort(filters, sortValue);
    };

    const handleFilterChange = (newFilters: { license: string; language: string }) => {
        setFilters(newFilters);
        applyFiltersAndSort(newFilters, sort);
    };

    return (
        <>
            <ResultSummary
                currentPage={currentPage}
                totalProjects={totalProjects}
                totalPages={totalPages}
                sort={sort}
                onSortChange={handleSortChange}
                filters={filters}
                onFilterChange={handleFilterChange}
            />
            <PaginationContainer
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalProjects={totalProjects}
                projectsPerPage={projectsPerPage}
            />
            <SearchResultContainer result={result} />
        </>
    )
};

export default ResultSummaryContainer;