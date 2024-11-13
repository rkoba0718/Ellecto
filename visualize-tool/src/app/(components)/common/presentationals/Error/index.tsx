"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

type ErrorProps = {
  message: string;
};

const Error: React.FC<ErrorProps> = ({
    message,
}) => {
  return (
    <div className="flex items-center justify-center bg-red-100 border border-red-300 rounded-md px-4 py-10 mt-4 mb-4 mx-8">
        <div className="flex flex-col items-center">
            <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-3xl" />
                <div className="text-red-700 font-medium text-center text-3xl">{message}</div>
            </div>
            <p className="text-red-700 text-center mt-4">Please try again after refreshing the page or contact support if the issue persists.</p>
        </div>
    </div>
  );
};

export default Error;
