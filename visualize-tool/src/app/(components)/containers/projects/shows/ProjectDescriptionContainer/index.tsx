"use client";

import React from "react";

import { Description } from "@/app/types/Description";
import ProjectDescription from "@/app/(components)/presentationals/projects/shows/ProjectDescription";

type ProjectDescriptionContainerProps = {
    description: Description;
};

const ProjectDescriptionContainer: React.FC<ProjectDescriptionContainerProps> = ({
    description,
}) => {
    return (
        <ProjectDescription description={description} />
    );
};

export default ProjectDescriptionContainer;