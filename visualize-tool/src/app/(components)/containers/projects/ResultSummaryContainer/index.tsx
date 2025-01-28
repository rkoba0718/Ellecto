"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import { Filters } from "@/app/types/Filters";
import { useSortOrderStore } from "@/app/lib/stores/useSortStore";
import { projectsPerPage } from "@/app/(components)/containers/providers/ProjectsProvider/config";
import ResultSummary from "@/app/(components)/presentationals/projects/ResultSummary";
import PaginationContainer from "../../../common/containers/PaginationContainer";
import SearchResultContainer from "../SearchResultContainer";

type ResultSummaryContainerProps = {
    result: ProjectInfo[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalProjects: number;
    sort: string;
    filters: Filters;
    applyFiltersAndSort: (filters: Filters, sort: string, sortOrder: string) => void;
};

const ResultSummaryContainer: React.FC<ResultSummaryContainerProps> = ({
    result,
    currentPage,
    setCurrentPage,
    totalProjects,
    sort,
    filters,
    applyFiltersAndSort
}) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const { sortOrder, setSortOrder } = useSortOrderStore();

    const handleSortChange = (sortValue: string) => {
        applyFiltersAndSort(filters, sortValue, sortOrder);
    };

    const onToggleSortOrder = (sortOrder: 'up' | 'down') => {
        setSortOrder(sortOrder);
        applyFiltersAndSort(filters, sort, sortOrder);
    };

    const handleFilterChange = (newFilters: { license: string; language: string }) => {
        applyFiltersAndSort(newFilters, sort, sortOrder);
    };

    return (
        <>
            <ResultSummary
                currentPage={currentPage}
                totalProjects={totalProjects}
                totalPages={totalPages}
                sort={sort}
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                onToggleSortOrder={onToggleSortOrder}
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