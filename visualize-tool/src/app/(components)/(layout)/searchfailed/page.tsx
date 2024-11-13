"use client";

import React from "react";
import Link from "next/link";

import Error from "../../common/presentationals/Error";

const SearchFailed: React.FC = () => {
    return (
        <div className="container mx-auto px-10 py-10">
            <Error message="Search failed. Please try again." />
            <div className="mt-5 text-xl text-center">
                <Link href="/" className="text-blue-600 hover:underline">
                    Return to search page
                </Link>
            </div>
        </div>
    );
};

export default SearchFailed;