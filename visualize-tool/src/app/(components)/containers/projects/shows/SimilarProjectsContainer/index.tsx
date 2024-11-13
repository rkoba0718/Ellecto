"use client";

import React, { useEffect, useState } from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import { Error } from "@/app/types/Error";
import SimilarProjects from "@/app/(components)/presentationals/projects/shows/similar/SimilarProjects";

type SimilarProjectsContainerProps = {
    packageName: string;
};

const SimilarProjectsContainer: React.FC<SimilarProjectsContainerProps> = ({
    packageName,
}) => {
    const [similarProjects, setSimilarProjects] = useState<ProjectInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // APIエンドポイントから類似プロジェクトのデータを取得
                const response = await fetch(`/api/similar/${encodeURIComponent(packageName)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    setError({ status: response.status, message: errorData.message });
                    return;
                }
                const data = await response.json();
                setSimilarProjects(data);
            } catch (error) {
                console.error("Failed to fetch similar projects:", error);
                setError({ status: 500, message: "An unexpected error occurred." });
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [packageName]);

    return (
        <SimilarProjects
            projects={similarProjects}
            loading={loading}
            error={error}
        />
    );
};

export default SimilarProjectsContainer;