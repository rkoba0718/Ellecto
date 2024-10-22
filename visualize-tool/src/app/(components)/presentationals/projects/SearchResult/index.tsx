"use client";

import React from "react";
import { ProjectInfo } from "@/app/types/ProjectInfo";
import ProjectCard from "../ProjectCard";

type SearchResultProps = {
    result: ProjectInfo[];
};

const SearchResult: React.FC<SearchResultProps> = ({
    result
}) => {
    return (
        <div>
            {result.map((project, index) => (
                <ProjectCard key={index} project={project} />
            ))}
        </div>
    )
};

export default SearchResult;