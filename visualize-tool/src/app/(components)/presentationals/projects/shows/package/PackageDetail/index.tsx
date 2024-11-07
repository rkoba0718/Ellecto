"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

import { Dependency } from "@/app/types/Dependency";
import { Package } from "@/app/types/Package";
import NoData from "@/app/(components)/common/presentationals/NoData";
import PaginationContainer from "@/app/(components)/common/containers/PaginationContainer";

type DependItemProps = {
    dep: Dependency;
};

const DependItem: React.FC<DependItemProps> = ({
    dep
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="border border-gray-300 rounded-md px-3 py-1 mb-1">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleExpand}>
                <span>{dep.Name}</span>
                <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} />
            </div>
            {expanded && (
                <div className="mt-2 pl-4 text-sm text-gray-600">
                    <p><strong>Version: </strong>{dep.Operator && dep.Version ? `${dep.Operator}${dep.Version}` : '-'}</p>
                    <p><strong>Architecture: </strong>{dep.Architecture ? dep.Architecture : '-'}</p>
                </div>
            )}
        </div>
    );
};

type PackageDetailProps = {
    packageDetailData: Package[string];
    currentDepends: Dependency[] | undefined;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalDepends: number;
    dependsPerPage: number;
};

const PackageDetail: React.FC<PackageDetailProps> = ({
    packageDetailData,
    currentDepends,
    currentPage,
    setCurrentPage,
    totalDepends,
    dependsPerPage
}) => {
    return (
        <div className="p-4 border rounded-md bg-gray-50">
            <h2 className="font-bold text-2xl mb-3">{packageDetailData.Name}</h2>
            {packageDetailData.Description?.summary ? (
                <p className="text-xl text-gray-700 mb-1">
                    {packageDetailData.Description.summary}
                </p>
            ) : (
                <NoData message="No description" />
            )}
            <p className="text-gray-700 mb-2">
                {packageDetailData.Description?.detail || ''}
            </p>
            <p className="text-gray-600 mb-1">
                <strong>Architecture:</strong> {packageDetailData.Architecture || '-'}
            </p>
            <div className="text-gray-600">
                <div className="font-semibold mb-2">
                    Depends List
                </div>
                {currentDepends ? (
                    <div className="space-y-2">
                        {currentDepends.map((dep, index) => (
                            <DependItem
                                key={index}
                                dep={dep}
                            />
                        ))}
                        <PaginationContainer
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalProjects={totalDepends}
                            projectsPerPage={dependsPerPage}
                        />
                    </div>
                ) : (
                    <NoData message="No dependencies" />
                )}
            </div>
        </div>
    );
};

export default PackageDetail;