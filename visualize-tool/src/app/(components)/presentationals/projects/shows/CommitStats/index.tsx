"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import Loading from "@/app/(components)/common/presentationals/Loading";
import NoData from "@/app/(components)/common/presentationals/NoData";

type CommitStatsProps = {
    loading: boolean;
    graphData: { month: string; commits: number }[];
    totalCommits: number;
    firstCommitDate: string;
    lastCommitDate: string;
};

const CommitStats: React.FC<CommitStatsProps> = ({
    loading,
    graphData,
    totalCommits,
    firstCommitDate,
    lastCommitDate,
}) => {
    return (
        <div>
            <h2 className="font-bold text-xl mb-2">Activity</h2>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {graphData.length === 0 ? (
                        <NoData message="No commit data" />
                    ) : (
                        <div className="p-4 border rounded-md shadow">
                            <h3 className="text-xl font-bold mb-4">Commits per Month</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="commits"
                                        stroke="#065f46"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5 }}
                                        />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex justify-between text-center mt-2">
                                <div className="flex-1 ml-2">
                                    <p className="text-gray-700 mb-1">
                                        <strong>First Commit:</strong> {firstCommitDate}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Last Commit:</strong> {lastCommitDate}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold">{totalCommits}</h3>
                                    <p className="text-gray-600">Total Commits</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommitStats;