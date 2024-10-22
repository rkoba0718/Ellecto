"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import SearchResult from "../../../presentationals/projects/SearchResult";

type SearchResultContainerProps = {
    result: ProjectInfo[];
};

const SearchResultContainer: React.FC<SearchResultContainerProps> = ({
    result
}) => {

    return (
        <SearchResult
            result={result}
        />
    )
};

export default SearchResultContainer;