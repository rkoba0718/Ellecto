"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import ProjectTitle from "@/app/(components)/presentationals/projects/shows/ProjectTitle";

type ProjectTitleContainerProps = {
    project: ProjectInfo;
};

const ProjectTitleContainer: React.FC<ProjectTitleContainerProps> = ({
    project,
}) => {
    return (
        <ProjectTitle
            name={project.Name}
            section={
                project.Section
                ? project.Section
                : undefined
            }
        />
    );
};

export default ProjectTitleContainer;