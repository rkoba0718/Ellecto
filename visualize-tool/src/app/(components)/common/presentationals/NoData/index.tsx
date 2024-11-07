"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

type NoDataProps = {
  message: string;
};

const NoData: React.FC<NoDataProps> = ({
    message,
}) => {
  return (
    <div className="flex items-center justify-center bg-green-100 border border-green-300 rounded-md px-4 py-10 mt-4 mb-4 mx-8">
      <div className="flex items-center space-x-3">
        <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 h-6 w-6" />
        <div className="text-green-700 font-medium text-center">{message}</div>
      </div>
    </div>
  );
};

export default NoData;
