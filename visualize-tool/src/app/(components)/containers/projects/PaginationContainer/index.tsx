"use client";

import React from "react";

import { projectsPerPage } from "@/app/(components)/containers/providers/ProjectsProvider/config";
import Pagination from "@/app/(components)/presentationals/projects/Pagination";

type PaginationContainerProps = {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalProjects: number;
};

const PaginationContainer: React.FC<PaginationContainerProps> = ({
    currentPage,
    setCurrentPage,
    totalProjects
}) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    return (
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    )
};

export default PaginationContainer;