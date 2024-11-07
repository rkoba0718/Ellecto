"use client";

import React from "react";

import { Package } from "@/app/types/Package";

type PackageListProps = {
    currentPackageKeys: string[];
    packageData: Package;
    onSelectPackage: (key: string) => void;
};

const PackageList: React.FC<PackageListProps> = ({
    currentPackageKeys,
    packageData,
    onSelectPackage,
}) => {
    return (
        <>
            {currentPackageKeys.map((key) => (
                <div
                    key={key}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => onSelectPackage(key)}
                >
                    <p className="font-semibold">{packageData[key].Name}</p>
                    <p className="text-gray-600 text-sm">
                        {packageData[key].Description?.summary || "No summary description"}
                    </p>
                </div>
            ))}
        </>
    );
};

export default PackageList;