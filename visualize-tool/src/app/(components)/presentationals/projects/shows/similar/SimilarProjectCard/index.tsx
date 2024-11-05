"use client";

import React from "react";
import Link from "next/link";

import { ProjectInfo } from "@/app/types/ProjectInfo";

type SummaryViewProps = {
    project: ProjectInfo;
};

const SummaryView: React.FC<SummaryViewProps> = ({
    project,
}) => {
    const summaries = Object.keys(project.Package)
        .map((pkgKey) => project.Package[pkgKey].Description?.summary)
        .filter((s) => s !== undefined);
    const length = summaries.length;

    return (
        <div className="ml-2">
            {length === 0 ? (
                <div>{project.Description.summary}.</div>
            ) :
            length === 1 ? (
                <div>{summaries[0]}.</div>
            ) : (
                <>
                    <div>{summaries[0]}.</div>
                    <Link href={`/projects/${project._id}`} className="text-blue-500 hover:underline">
                        ...more
                    </Link>
                </>
            )}
        </div>
    );
};

type SimilarProjectCardProps = {
    project: ProjectInfo;
};

const SimilarProjectCard: React.FC<SimilarProjectCardProps> = ({
    project,
}) => {
    return (
        <div className="w-full md:w-1/6 p-4 border rounded-md shadow bg-white min-w-[200px] flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold mb-2">
                    <Link href={`/projects/${project._id}`} className="text-blue-500 hover:underline">
                        {project.Name}
                    </Link>
                </h3>
                <p className="text-gray-700 mb-4">
                    <SummaryView project={project} />
                </p>
            </div>
            <div className="mt-auto text-gray-700">
                <p>
                    <strong>Language:</strong> {project.Language.Lang1.Name}
                </p>
                <p>
                    <strong>License:</strong> {project.License}
                </p>
            </div>
        </div>
    );
};

export default SimilarProjectCard;