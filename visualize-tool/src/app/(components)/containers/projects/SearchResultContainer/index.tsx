"use client";

import React from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import SearchResult from "../../../presentationals/projects/SearchResult";
import NoResultMessage from "../../../presentationals/projects/NoResultMessage";

type SearchResultContainerProps = {
    result: ProjectInfo[];
};

const SearchResultContainer: React.FC<SearchResultContainerProps> = ({
    result
}) => {

    return (
        <>
            {result.length === 0 ? (
                <NoResultMessage />
            ) : (
                <SearchResult
                    result={result}
                />
            )}
        </>
    )
};

export default SearchResultContainer;