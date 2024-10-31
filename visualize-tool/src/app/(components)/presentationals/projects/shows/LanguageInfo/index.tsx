"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

type LanguageInfoProps = {
    data: {
        name: string;
        percentage: number;
        color: string;
    }[];
    loc: number;
};

const LanguageInfo: React.FC<LanguageInfoProps> = ({
    data,
    loc
}) => {
    return (
        <div className="flex items-center">
            <div className="mr-3">
                <PieChart width={250} height={200}>
                    <Pie
                        data={data}
                        cx="60%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        startAngle={90}
                        endAngle={-270}
                        fill="#8884d8"
                        dataKey="percentage"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
            <div className="mt-6">
                <ul className="space-y-1">
                    {data.map((entry, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}</span>
                            <span>{entry.percentage}%</span>
                        </li>
                    ))}
                </ul>
                <h3 className="mt-3"><strong>LOC:</strong> {loc}</h3>
            </div>
        </div>
    );
};

export default LanguageInfo;