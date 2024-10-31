"use client";

import React from "react";

import Pagination from "@/app/(components)/common/presentationals/Pagination";

type PaginationContainerProps = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalProjects: number;
    projectsPerPage: number;
};

const PaginationContainer: React.FC<PaginationContainerProps> = ({
    currentPage,
    setCurrentPage,
    totalProjects,
    projectsPerPage
}) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    return (
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    )
};

export default PaginationContainer;