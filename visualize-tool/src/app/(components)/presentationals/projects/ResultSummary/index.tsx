"use client";

import React from "react";

type ResultSummaryProps = {
    currentPage: number;
    totalProjects: number;
    totalPages: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
    currentPage,
    totalProjects,
    totalPages
}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <p>
                Showing page {currentPage} of {totalPages} (Total {totalProjects} projects)
            </p>
            <div>
                {/* TODO: ソート処理 */}
                <label htmlFor="sort" className="mr-2">Sort by:</label>
                <select id="sort" className="border p-1">
                    <option value="relevance">Relevance</option>
                    <option value="name">Name</option>
                    <option value="section">Section</option>
                </select>
            </div>
        </div>
    )
};

export default ResultSummary;