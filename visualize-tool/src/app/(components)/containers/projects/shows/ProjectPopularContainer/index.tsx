import React, { useState, useEffect } from "react";

import { Error as ErrorType } from "@/app/types/Error";
import { fetchGithubRepoData, fetchSalsaDebianRepoData } from "@/app/lib/restAPI";
import ProjectPopular from "@/app/(components)/presentationals/projects/shows/ProjectPopular";

type ProjectPopularContainerProps = {
    url: string | undefined;
};

const ProjectPopularContainer: React.FC<ProjectPopularContainerProps> = ({
    url
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [stars, setStars] = useState(0);
    const [forks, setForks] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (url === undefined) {
                setLoading(false);
                setError(true);
                return
            };
            setLoading(true);
            try {
                const data = url.includes('github.com')
                    ? await fetchGithubRepoData(url)
                    : url.includes('salsa.debian.org')
                    ? await fetchSalsaDebianRepoData(url)
                    : null;
                if (data === null) {
                    setLoading(false);
                    setError(true);
                    return;
                };
                setStars(data.stars);
                setForks(data.forks);
            } catch (error) {
                console.error("Error fetching repository data:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return (
        <ProjectPopular
            loading={loading}
            error={error}
            stars={stars}
            forks={forks}
        />
    );
};

export default ProjectPopularContainer;