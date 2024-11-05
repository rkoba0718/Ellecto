"use client";

import React, { useState } from "react";

import { Package } from "@/app/types/Package";
import PackageInfo from "@/app/(components)/presentationals/projects/shows/package/PackageInfo";

const packagesPerPage = 8; // 一度に表示するバイナリパッケージの数

type PackageInfoContainerProps = {
    packageData: Package;
};

const PackageInfoContainer: React.FC<PackageInfoContainerProps> = ({
    packageData
}) => {
    const packages = Object.keys(packageData);
    const initialPackage = packages[0] || null; // 初期表示するパッケージ
    const [selectedPackageKey, setSelectedPackageKey] = useState<string | null>(initialPackage);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSelectPackage = (key: string) => {
        setSelectedPackageKey(key);
    };

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackageKeys = packages.slice(indexOfFirstPackage, indexOfLastPackage);

    return (
        <PackageInfo
            packageData={packageData}
            currentPackageKeys={currentPackageKeys}
            selectedPackageKey={selectedPackageKey}
            onSelectPackage={handleSelectPackage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPackages={packages.length}
            packagesPerPage={packagesPerPage}
        />
    );
};

export default PackageInfoContainer;