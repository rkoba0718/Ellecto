"use client";

import React, { useState, useEffect } from "react";

import { Error } from "@/app/types/Error";
import { Dependency } from "@/app/types/Dependency";
import { ProjectInfo } from "@/app/types/ProjectInfo";
import DependencyInfoContainer from "@/app/(components)/common/containers/dependency/DependencyInfoContainer";

type DependencyContainerProps = {
    kind: "Run-time" | "Build";
    selectedProjectName: string;
    dependencies: Dependency[] | undefined;
}

const DependencyContainer: React.FC<DependencyContainerProps> = ({
    kind,
    selectedProjectName,
    dependencies,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [transitiveDependencies, setTransitiveDependencies] = useState<ProjectInfo[]>([]);

    useEffect(() => {
        const getTransitive = async () => {
            if (dependencies === undefined) {
                setTransitiveDependencies([]);
                return;
            }
            setLoading(true);
            const names = dependencies.map((item) => `${encodeURIComponent(item.Name)}`).join('&');
            try {
                const response = await fetch(`/api/dependency/${names}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    setError({ status: response.status, message: errorData.message });
                    return;
                }
                const data = await response.json();
                setTransitiveDependencies(data.transitiveDependencies);
            } catch (error) {
                console.log("Error get transitive dependencies: ", error);
            } finally {
                setLoading(false);
            }
        };
        getTransitive();
    }, []);

    return (
        <DependencyInfoContainer
            loading={loading}
            error={error}
            kind={kind}
            selectedProjectName={selectedProjectName}
            dependencies={dependencies}
            transitiveDependencies={transitiveDependencies}
        />
    );
};

export default DependencyContainer;