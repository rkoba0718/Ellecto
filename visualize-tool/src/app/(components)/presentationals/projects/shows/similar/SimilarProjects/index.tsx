"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import Loading from "@/app/(components)/common/presentationals/Loading";
import SimilarProjectCard from "../SimilarProjectCard";
type SimilarProjectsProps = {
    projects: ProjectInfo[];
    loading: boolean;
};

const SimilarProjects: React.FC<SimilarProjectsProps> = ({
    projects,
    loading
}) => {
    return (
        <div className="pb-2">
            <h2 className="font-bold text-xl mb-2">Similar Projects</h2>
            <>
                {loading ? (
                    <Loading />
                ) : projects.length === 0 ? (
                    <div className="text-gray-500">
                        No Similar Projects
                    </div>
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