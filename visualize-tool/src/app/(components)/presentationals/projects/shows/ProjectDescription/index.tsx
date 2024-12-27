"use client";

import React from "react";

import { Description } from "@/app/types/Description";
import NoData from "@/app/(components)/common/presentationals/NoData";

type ProjectDescriptionProps = {
    description: Description;
};

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
    description,
}) => {
    return (
        <div className="p-6 border rounded-md bg-gray-50">
            {description.summary === '' ? (
                <NoData message="No description" />
            ) : (
                <>
                    <p className="text-xl text-gray-700">
                        {description.summary}
                    </p>
                    <hr className="border-gray-300 my-2" />
                    <p className="text-gray-600 mb-2">
                        {description.detail}
                    </p>
                </>
            )}
        </div>
    );
};

export default ProjectDescription;