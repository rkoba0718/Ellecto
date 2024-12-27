"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram, faList } from "@fortawesome/free-solid-svg-icons";

import { Error as ErrorType } from "@/app/types/Error";
import { Dependency } from "@/app/types/Dependency";
import { Graph } from "@/app/types/Graph";
import { ProjectInfo } from "@/app/types/ProjectInfo";
import Loading from "@/app/(components)/common/presentationals/Loading";
import Error from "@/app/(components)/common/presentationals/Error";
import DependencyGraph from "@/app/(components)/common/presentationals/dependency/DependencyGraph";
import DependencyList from "@/app/(components)/common/presentationals/dependency/DependencyList";
import PaginationContainer from "@/app/(components)/common/containers/PaginationContainer";

type DependencyInfoProps = {
    loading: boolean;
    error: ErrorType | null;
    kind: "Run-time" | "Build";
    dependencies: Dependency[];
    viewMode: 'graph' | 'list';
    toggleViewMode: (mode: 'graph' | 'list') => void;
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    graphData: Graph;
    transitiveDependencies: ProjectInfo[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalDependencies: number;
    dependenciesPerPage: number;
}

const DependencyInfo: React.FC<DependencyInfoProps> = ({
    loading,
    error,
    kind,
    dependencies,
    viewMode,
    toggleViewMode,
    filter,
    setFilter,
    graphData,
    transitiveDependencies,
    currentPage,
    setCurrentPage,
    totalDependencies,
    dependenciesPerPage
}) => {
    return (
        <>
            <h2 className="font-bold text-xl mb-2">Dependencies for {kind}</h2>
            {loading ? (
                <Loading />
            ) : error ? (
                <Error message={`${error.status} ${error.message}`} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => toggleViewMode('graph')}
                                className={`text-sm px-3 py-1 rounded mr-1 ${
                                    viewMode === 'graph' ? 'bg-green-500 text-white' : 'bg-transparent text-green-500 hover:bg-green-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={faProjectDiagram} className="mr-1" />
                                Graph
                            </button>
                            <button
                                onClick={() => toggleViewMode('list')}
                                className={`text-sm px-3 py-1 rounded mr-3 ${
                                    viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-transparent text-green-500 hover:bg-green-100'
                                }`}
                            >
                                <FontAwesomeIcon icon={faList} className="mr-1" />
                                List
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter direct dependencies..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-1/2 min-w-[280px]"
                        />
                    </div>
                    {
                        viewMode === 'graph' ? (
                            <DependencyGraph
                                graphData={graphData}
                            />
                        ) : (
                            <>
                                <DependencyList
                                    dependencies={dependencies}
                                    transitiveDependencies={transitiveDependencies}
                                />
                                <PaginationContainer
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalProjects={totalDependencies}
                                    projectsPerPage={dependenciesPerPage}
                                />
                            </>
                        )
                    }
                </>
            )}
        </>
    );
};

export default DependencyInfo;