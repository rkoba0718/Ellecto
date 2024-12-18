"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCodeFork } from "@fortawesome/free-solid-svg-icons";

type ProjectPopularProps = {
    loading: boolean;
    error: boolean;
    stars: number;
    forks: number;
};

const ProjectPopular: React.FC<ProjectPopularProps> = ({
    loading,
    error,
    stars,
    forks
}) => {
    return (
        <>
            {loading ? (
                <></>
            ) : error ? (
                <></>
            ) : (
                <div className="flex gap-2">
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-md text-2xl text-green-600">
                        <FontAwesomeIcon icon={faStar} className="mr-2" />
                        <div className="font-semibold">{stars}</div>
                        <div className="text-xl ml-1">stars</div>
                    </div>
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-md text-2xl text-green-600">
                        <FontAwesomeIcon icon={faCodeFork} className="mr-2" />
                        <div className="font-semibold">{forks}</div>
                        <div className="text-xl ml-1">forks</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectPopular;