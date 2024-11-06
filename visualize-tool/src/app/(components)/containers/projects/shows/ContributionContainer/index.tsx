"use client";

import React, { useEffect, useState } from "react";

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

    useEffect(() => {
        const fetchData = async () => {
            // TODO: Not表示
            if (url === undefined) return;
            setLoading(true);
            try {
                const data = url.includes('github.com')
                    ? await fetchGithubContributorData(url)
                    : url.includes('salsa.debian.org')
                    ? await fetchSalsaDebianContributorData(url)
                    : null;
                // TODO: null表示
                if (data === null) return;
                setContributorData(data);
            } catch (error) {
                // TODO: エラー処理
                console.error("Error fetching community data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return (
        <Contribution
            loading={loading}
            contributors={contributorData}
        />
    );
};

export default ContributionContainer;