"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import Loading from "@/app/(components)/common/presentationals/Loading";
import NoData from "@/app/(components)/common/presentationals/NoData";
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