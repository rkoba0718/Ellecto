"use client";

import React from "react";

type ResultSummaryProps = {
    currentPage: number;
    totalProjects: number;
    totalPages: number;
    sort: string;
    onSortChange: (sort: string) => void;
    filters: { license: string; language: string };
    onFilterChange: (filters: { license: string; language: string }) => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
    currentPage,
    totalProjects,
    totalPages,
    sort,
    onSortChange,
    filters,
    onFilterChange
}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <p>
                Showing page {currentPage} of {totalPages} (Total {totalProjects} projects)
            </p>
            <div className="flex items-center space-x-4">
                <div>
                    <label htmlFor="sort" className="mr-2">Sort by:</label>
                    <select
                        id="sort"
                        className="border p-1"
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="name">Name</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="language" className="mr-2">Language:</label>
                    <input
                        id="language"
                        type="text"
                        value={filters.language}
                        onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
                        className="border p-1"
                        placeholder="Filter by Language"
                    />
                </div>
                <div>
                    <label htmlFor="license" className="mr-2">License:</label>
                    <input
                        id="license"
                        type="text"
                        value={filters.license}
                        onChange={(e) => onFilterChange({ ...filters, license: e.target.value })}
                        className="border p-1"
                        placeholder="Filter by License"
                    />
                </div>
            </div>
        </div>
    )
};

export default ResultSummary;