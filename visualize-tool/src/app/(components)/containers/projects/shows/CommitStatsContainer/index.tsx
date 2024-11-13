"use client";

import React, { useEffect, useState } from "react";

import { Error } from "@/app/types/Error";
import CommitStats from "@/app/(components)/presentationals/projects/shows/CommitStats";

type CommitStatsContainerProps = {
    projectName: string;
    url: string | undefined;
};

const CommitStatsContainer: React.FC<CommitStatsContainerProps> = ({
    projectName,
    url,
}) => {
    const [commitData, setCommitData] = useState<{ [month: string]: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalCommits, setTotalCommits] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (url === undefined) {
                setLoading(false);
                return
            };
            setLoading(true);
            try {
                const response = await fetch(`/api/commit/${encodeURIComponent(projectName)}/${encodeURIComponent(url)}`);
                if (response === null) {
                    setLoading(false);
                    return;
                };
                if (!response.ok) {
                    const errorData = await response.json();
                    setError({ status: response.status, message: errorData.message });
                    return;
                }
                const data = await response.json();
                setCommitData(data.newCacheData);
                setTotalCommits(data.totalCommits);
            } catch (error) {
                console.error("Error fetching community data:", error);
                setError({ status: 500, message: "An unexpected error occurred." });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectName, url]);

    const sortedData = commitData
        ? Object.entries(commitData)
            .sort(([a], [b]) => (a > b ? 1 : -1)) // 年月の昇順でソート
        : [];
    const graphData = sortedData.length !== 0
        ? sortedData.map(([month, commits]) => ({ month, commits }))
        : [];
    const firstCommitDate = graphData.length !== 0
        ? graphData[0].month
        : '';
    const lastCommitDate = graphData.length !== 0
        ? graphData[graphData.length - 1].month
        : '';

    return (
        <CommitStats
            loading={loading}
            error={error}
            graphData={graphData}
            totalCommits={totalCommits}
            firstCommitDate={firstCommitDate}
            lastCommitDate={lastCommitDate}
        />
    );
};

export default CommitStatsContainer;