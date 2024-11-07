"use client";

import React from "react";

type ProjectTitleProps = {
    name: string;
    section: string | undefined;
};

const ProjectTitle: React.FC<ProjectTitleProps> = ({
    name,
    section
}) => {
    return (
        <div className="text-center pb-2">
            <h1 className="text-3xl font-bold mb-4">{name}</h1>
            {section && (
                <span className="text-sm text-green-600 bg-green-100 rounded-full px-3 py-1 mr-2 inline-block">
                    {section}
                </span>
            )}
        </div>
    );
};

export default ProjectTitle;