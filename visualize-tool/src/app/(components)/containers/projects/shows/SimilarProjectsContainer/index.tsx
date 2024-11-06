"use client";

import React, { useEffect, useState } from "react";

import { ProjectInfo } from "@/app/types/ProjectInfo";
import SimilarProjects from "@/app/(components)/presentationals/projects/shows/similar/SimilarProjects";

type SimilarProjectsContainerProps = {
    packageName: string;
};

const SimilarProjectsContainer: React.FC<SimilarProjectsContainerProps> = ({
    packageName,
}) => {
    const [similarProjects, setSimilarProjects] = useState<ProjectInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // APIエンドポイントから類似プロジェクトのデータを取得
                const response = await fetch(`/api/similar/${encodeURIComponent(packageName)}`);
                const data = await response.json();
                setSimilarProjects(data);
            } catch (error) {
                // TODO: エラー処理
                console.error("Failed to fetch similar projects:", error);
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
        />
    );
};

export default SimilarProjectsContainer;