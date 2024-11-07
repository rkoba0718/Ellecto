"use client";

import React, { useState } from "react";

import { Dependency } from "@/app/types/Dependency";
import { ProjectInfo } from "@/app/types/ProjectInfo";
import { Graph } from "@/app/types/Graph";
import NoData from "@/app/(components)/common/presentationals/NoData";
import DependencyInfo from "@/app/(components)/presentationals/projects/shows/dependency/DependencyInfo";

const dependenciesPerPage = 5; // 1ページに表示する依存関係の数

type DependencyInfoContainerProps = {
    selectedProjectName: string;
    dependencies: Dependency[] | undefined;
    transitiveDependencies: ProjectInfo[];
};

const DependencyInfoContainer: React.FC<DependencyInfoContainerProps> = ({
    selectedProjectName,
    dependencies,
    transitiveDependencies
}) => {
    const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
    const [listCurrentPage, setListCurrentPage] = useState(1);
    const [filter, setFilter] = useState("");

    const toggleViewMode = (mode: 'graph' | 'list') => {
        setViewMode(mode);
    };

    const filteredDependencies = dependencies?.filter(dep =>
        dep.Name.toLowerCase().includes(filter.toLowerCase())
    );

    const nodeSet = new Set<string>(); // 重複ノードを排除するためのセット
    const nodes = filteredDependencies !== undefined && transitiveDependencies.length > 0
        // 直接的依存関係も推移的依存関係（ネスト＝１）も存在する場合，重複を除いたどちらの要素もnodesに追加
        ? [
            // 自分自身
            {
                id: selectedProjectName,
                color: "#32CD32" // 🟢
            },
            // 他の直接的な依存関係ノード
            ...filteredDependencies
                .map((dep) => {
                    nodeSet.add(dep.Name);
                    return ({ id: dep.Name, color: "#B0B0B0" });
                }),
            // 推移的な依存関係ノード
            ...transitiveDependencies.flatMap((tdep) =>
                tdep['Build-Depends']
                    ? tdep['Build-Depends']
                        .filter((buildDep: any) => {
                            // フィルターされた直接的依存関係に含まれているかつ重複を避けるため、初めて見るノードのみ追加
                            if (nodeSet.has(tdep.Name) && !nodeSet.has(buildDep.Name)) {
                                nodeSet.add(buildDep.Name);
                                return buildDep.Name;
                            }
                        })
                        .map((buildDep: any) => ({
                            id: buildDep.Name,
                            color: "#D3D3D3",
                        }))
                    : []
            ),
        ] : filteredDependencies !== undefined
        // 推移的依存関係はないが，直接的依存関係が存在する場合
        ? [
            // 自分自身
            {
                id: selectedProjectName,
                color: "#32CD32" // 🟢
            },
            // 他の依存関係ノード
            ...filteredDependencies.map((dep) => ({
                id: dep.Name,
                color: "#B0B0B0", // 灰色
            })),
        ] : [];

    const links = filteredDependencies !== undefined && transitiveDependencies.length > 0
        // 直接的依存関係も推移的依存関係（ネスト＝１）も存在する場合，依存関係のリンクを接続
        ? [
            ...filteredDependencies.map((dep) => ({ source: selectedProjectName, target: dep.Name })),
            ...transitiveDependencies.flatMap((tdep) =>
                tdep['Build-Depends']
                    ? tdep['Build-Depends'].filter(((buildDep: any) => {
                        if (nodeSet.has(tdep.Name)) {
                            return buildDep.Name;
                        }
                    }))
                    .map((buildDep: any) => ({
                        source: tdep.Name,
                        target: buildDep.Name
                    }))
                    : []
            )
        ] : filteredDependencies !== undefined
        // 推移的依存関係はないが，直接的依存関係が存在する場合，直接的依存関係のリンクのみ接続
        ? filteredDependencies.flatMap((dep) => [
            {
                source: selectedProjectName,
                target: dep.Name,
            }
        ]) : [];

    const graphData: Graph = {
        nodes: nodes,
        links: links
    };

    const totalDependencies = filteredDependencies ? filteredDependencies.length : 0;
    const indexOfLastDependency = listCurrentPage * dependenciesPerPage;
    const indexOfFirstDependency = indexOfLastDependency - dependenciesPerPage;
    const currentDependencies = filteredDependencies?.slice(indexOfFirstDependency, indexOfLastDependency);

    return (
        currentDependencies === undefined ? (
            <>
                <h2 className="font-bold text-xl mb-2">Dependency Packages for Build</h2>
                <NoData message="No Dependencies" />
            </>
        ) : (
            <DependencyInfo
                dependencies={currentDependencies}
                viewMode={viewMode}
                toggleViewMode={toggleViewMode}
                filter={filter}
                setFilter={setFilter}
                graphData={graphData}
                transitiveDependencies={transitiveDependencies}
                currentPage={listCurrentPage}
                setCurrentPage={setListCurrentPage}
                totalDependencies={totalDependencies}
                dependenciesPerPage={dependenciesPerPage}
            />
        )
    );
};

export default DependencyInfoContainer;