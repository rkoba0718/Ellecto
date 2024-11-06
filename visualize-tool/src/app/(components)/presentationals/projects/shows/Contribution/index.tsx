"use client";

import React from "react";

import { Contributor } from "@/app/types/Contributor";
import Loading from "@/app/(components)/common/presentationals/Loading";

type ContributionProps = {
    loading: boolean;
    contributors: Contributor[] | null;
};

const Contribution: React.FC<ContributionProps> = ({
    loading,
    contributors
}) => {
    return (
        <div>
            <h2 className="font-bold text-xl mb-2">Top Contributors</h2>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {contributors === null ? (
                        <div className="text-gray-500">
                            No contributors data
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contributors.map((contributor, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border rounded-md shadow bg-white"
                                >
                                    <div className="flex items-center">
                                        {contributor.html_url ? (
                                            <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={contributor.avatar_url || ""}
                                                    alt={`${contributor.name}'s avatar`}
                                                    className="w-12 h-12 rounded-full mr-4"
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={contributor.avatar_url || ""}
                                                alt={`${contributor.name}'s avatar`}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        {contributor.html_url ? (
                                            <a
                                                href={contributor.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-lg font-semibold text-blue-600 hover:underline"
                                            >
                                                {contributor.name}
                                            </a>
                                        ) : (
                                            <p className="text-lg font-semibold">{contributor.name}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {contributor.email ? contributor.email : 'no email address'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">{contributor.contributions}</p>
                                        <p className="text-sm text-gray-500">contributions</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Contribution;