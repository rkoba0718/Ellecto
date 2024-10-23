"use client";

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type WeightButtonProps = {
    label: string;
    weight: number;
    setWeight: React.Dispatch<React.SetStateAction<number>>;
  };

const WeightButton: React.FC<WeightButtonProps> = ({ label, weight, setWeight }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">{label}: {weight}</label>
        <div className="flex space-x-4">
          {Array.from({ length: 5 }, (_, index) => index + 1).map((num) => (
            <button
              key={num}
              onClick={() => setWeight(num)}
              className={`rounded-full w-8 h-8 ${weight === num ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

type SearchFormProps = {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleSearchSubmit: (e: React.FormEvent) => void;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    license: string;
    setLicense: React.Dispatch<React.SetStateAction<string>>;
    showOptions: boolean;
    onToggleOptionsClick: () => void;
    searchTermWeight: number;
    setSearchTermWeight: React.Dispatch<React.SetStateAction<number>>;
    languageWeight: number;
    setLanguageWeight: React.Dispatch<React.SetStateAction<number>>;
    licenseWeight: number;
    setLicenseWeight: React.Dispatch<React.SetStateAction<number>>;
};

const SearchForm: React.FC<SearchFormProps> = ({
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    language,
    setLanguage,
    license,
    setLicense,
    showOptions,
    onToggleOptionsClick,
    searchTermWeight,
    setSearchTermWeight,
    languageWeight,
    setLanguageWeight,
    licenseWeight,
    setLicenseWeight
}) => {
    return(
        <div className="flex flex-col items-center pt-5">
            <form
                onSubmit={handleSearchSubmit}
                className="flex bg-gray-100 rounded-full px-4 py-2 mb-5 shadow-lg w-1/2"
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search OSS Project ..."
                    className="bg-transparent outline-none text-gray-600 px-4 py-2 flex-grow"
                />
                <button type="submit" className="text-gray-500">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
            <div className="w-1/2 text-right mb-5 pr-2">
                <button
                    onClick={onToggleOptionsClick}
                    className="text-green-600 hover:underline"
                >
                    {showOptions ? "Hide Options" : "Show Options"}
                </button>
            </div>
            {showOptions && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Language</label>
                        <input
                            type="text"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            placeholder="Type Language"
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">License</label>
                        <input
                            type="text"
                            value={license}
                            onChange={(e) => setLicense(e.target.value)}
                            placeholder="Type License"
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                        />
                    </div>

                    <WeightButton label="Keyword Weight" weight={searchTermWeight} setWeight={setSearchTermWeight} />
                    <WeightButton label="Language Weight" weight={languageWeight} setWeight={setLanguageWeight} />
                    <WeightButton label="License Weight" weight={licenseWeight} setWeight={setLicenseWeight} />

                    <p className="text-gray-500 text-sm mb-2">
                        These weights adjust the importance of each field in scoring the search results.
                    </p>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                            onClick={handleSearchSubmit}
                        >
                            Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default SearchForm;