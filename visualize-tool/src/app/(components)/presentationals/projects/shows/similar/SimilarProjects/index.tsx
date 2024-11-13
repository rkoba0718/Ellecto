"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import { Error as ErrorType } from "@/app/types/Error";
import Loading from "@/app/(components)/common/presentationals/Loading";
import Error from "@/app/(components)/common/presentationals/Error";
import NoData from "@/app/(components)/common/presentationals/NoData";
import SimilarProjectCard from "../SimilarProjectCard";
type SimilarProjectsProps = {
    projects: ProjectInfo[];
    loading: boolean;
    error: ErrorType | null;
};

const SimilarProjects: React.FC<SimilarProjectsProps> = ({
    projects,
    loading,
    error,
}) => {
    return (
        <div className="pb-2">
            <h2 className="font-bold text-xl mb-2">Similar Projects</h2>
            <>
                {loading ? (
                    <Loading />
                ) : error ? (
                    <Error message={`${error.status} ${error.message}`} />
                ) : projects.length === 0 ? (
                    <NoData message="No Similar Projects" />
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {projects.map((project, index) => (
                            <SimilarProjectCard key={index} project={project} />
                        ))}
                    </div>
                )}
            </>
        </div>
    );
};

export default SimilarProjects;