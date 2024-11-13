"use client";

import React, { useEffect, useState } from "react";

import { Error as ErrorType } from "@/app/types/Error";
import { fetchGithubContributorData, fetchSalsaDebianContributorData } from "@/app/lib/restAPI";
import { Contributor } from "@/app/types/Contributor";
import Contribution from "@/app/(components)/presentationals/projects/shows/Contribution";

type ContributionContainerProps = {
    url: string | undefined;
};

const ContributionContainer: React.FC<ContributionContainerProps> = ({
    url,
}) => {
    const [contributorData, setContributorData] = useState<Contributor[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (url === undefined) {
                setLoading(false);
                return
            };
            setLoading(true);
            try {
                const data = url.includes('github.com')
                    ? await fetchGithubContributorData(url)
                    : url.includes('salsa.debian.org')
                    ? await fetchSalsaDebianContributorData(url)
                    : null;
                if (data === null) {
                    setLoading(false)
                    return;
                };
                setContributorData(data);
            } catch (error) {
                console.error("Error fetching community data:", error);
                const errorMessage = error instanceof Error ? error.message : "Error fetching contribution data";
                setError({ status: 500, message: errorMessage });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return (
        <Contribution
            loading={loading}
            error={error}
            contributors={contributorData}
        />
    );
};

export default ContributionContainer;