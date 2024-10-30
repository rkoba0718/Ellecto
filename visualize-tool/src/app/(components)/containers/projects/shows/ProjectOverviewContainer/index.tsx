"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import ProjectOverview from "@/app/(components)/presentationals/projects/shows/ProjectOverview";

type ProjectOverviewContainerProps = {
    project: ProjectInfo
};

const ProjectOverviewContainer: React.FC<ProjectOverviewContainerProps> = ({
    project
}) => {
    return <ProjectOverview project={project} />;
};

export default ProjectOverviewContainer;
