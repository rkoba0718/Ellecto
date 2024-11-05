"use client";

import React, { useState } from "react";

import { Package } from "@/app/types/Package";
import PackageDetail from "@/app/(components)/presentationals/projects/shows/package/PackageDetail";

const dependsPerPage = 5; // 1ページに表示する依存関係の数

type PackageDetailContainerProps = {
    packageDetailData: Package[string];
};

const PackageDetailContainer: React.FC<PackageDetailContainerProps> = ({
    packageDetailData
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastDepend = currentPage * dependsPerPage;
    const indexOfFirstDepend = indexOfLastDepend - dependsPerPage;
    const currentDepends = packageDetailData.Depends
        ? packageDetailData.Depends.slice(indexOfFirstDepend, indexOfLastDepend)
        : undefined;

    return (
        <PackageDetail
            packageDetailData={packageDetailData}
            currentDepends={currentDepends}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalDepends={packageDetailData.Depends ? packageDetailData.Depends.length : 0}
            dependsPerPage={dependsPerPage}
        />
    );
};

export default PackageDetailContainer;