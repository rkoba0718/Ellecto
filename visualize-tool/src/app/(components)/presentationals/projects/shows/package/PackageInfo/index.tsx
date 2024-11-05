"use client";

import React from "react";

import { Package } from "@/app/types/Package";
import PackageList from "../PackageList";
import PaginationContainer from "@/app/(components)/common/containers/PaginationContainer";
import PackageDetailContainer from "@/app/(components)/containers/projects/shows/PackageDetailContainer";

type PackageInfoProps = {
    packageData: Package;
    currentPackageKeys: string[];
    selectedPackageKey: string | null;
    onSelectPackage: (key: string) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPackages: number;
    packagesPerPage: number;
};

const PackageInfo: React.FC<PackageInfoProps> = ({
    packageData,
    currentPackageKeys,
    selectedPackageKey,
    onSelectPackage,
    currentPage,
    setCurrentPage,
    totalPackages,
    packagesPerPage,
}) => {
    return (
        <div className="pb-2">
            <h2 className="font-bold text-xl mb-2">Binary Packages</h2>
            <div className="flex">
                <div className="w-2/5 pr-4">
                    <PackageList
                        currentPackageKeys={currentPackageKeys}
                        packageData={packageData}
                        onSelectPackage={onSelectPackage}
                    />
                    <PaginationContainer
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalProjects={totalPackages}
                        projectsPerPage={packagesPerPage}
                    />
                </div>
                <div className="w-3/5 pl-4">
                    {selectedPackageKey && (
                        <PackageDetailContainer
                            packageDetailData={packageData[selectedPackageKey]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageInfo;