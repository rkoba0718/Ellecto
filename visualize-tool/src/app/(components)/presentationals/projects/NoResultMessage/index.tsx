"use client";

import React from "react";

const NoResultMessage: React.FC = () => {
    return (
        <div className="py-10">
            <h2 className="text-xl font-bold text-gray-700 pb-2.5">No result found.</h2>
            <p className="text-gray-500">Try adjusting your search criteria and search again.</p>
        </div>
    )
};

export default NoResultMessage;