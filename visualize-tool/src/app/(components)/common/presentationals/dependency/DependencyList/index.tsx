"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

import { Dependency } from "@/app/types/Dependency";
import { ProjectInfo } from "@/app/types/ProjectInfo";

type DependencyItemProps = {
    dep: Dependency;
    transitiveDep: ProjectInfo | undefined;
};

const DependencyItem: React.FC<DependencyItemProps> = ({
    dep,
    transitiveDep
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="border border-gray-300 rounded-md px-3 py-1 mx-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleExpand}>
                <span>{dep.Name}</span>
                <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} />
            </div>
            {expanded && (
                <div className="mt-2 pl-4 text-sm text-gray-600">
                    <p><strong>Version: </strong>{dep.Operator && dep.Version ? `${dep.Operator}${dep.Version}` : '-'}</p>
                    <p><strong>Architecture: </strong>{dep.Architecture ? dep.Architecture : '-'}</p>
                    <p>
                        <strong>Dependency Packages: </strong>
                        {
                            transitiveDep === undefined
                            ? '-'
                            : transitiveDep['Build-Depends']
                                ? transitiveDep['Build-Depends'].map((tdep: Dependency, index: number) => (
                                    <span key={index} className="block ml-4">
                                        {tdep.Name}{tdep.Operator ? ` ${tdep.Operator}` : ''}{tdep.Version ? ` ${tdep.Version}` : ''}{tdep.Architecture ? `, ${tdep.Architecture}` : ''}
                                    </span>
                                ))
                                : '-'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

type DependencyListProps = {
    dependencies: Dependency[];
    transitiveDependencies: ProjectInfo[];
};

const DependencyList: React.FC<DependencyListProps> = ({
    dependencies,
    transitiveDependencies,
}) => {
    return (
        <div className="space-y-2">
            {dependencies && dependencies.length > 0 ? (
                dependencies.map((dep, index) => (
                    <DependencyItem
                        key={index}
                        dep={dep}
                        transitiveDep={
                            transitiveDependencies.filter((tdep) => tdep.Name === dep.Name).length !== 0
                            ? transitiveDependencies.filter((tdep) => tdep.Name === dep.Name)[0] // 一致する要素は必ず高々1個なので，その一つを渡してやれば良い
                            : undefined
                        }
                    />
                ))
            ) : (
                <p>No Dependencies</p>
            )}
        </div>
    );
};

export default DependencyList;