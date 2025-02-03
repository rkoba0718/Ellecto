"use client";

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Loading from "../../common/presentationals/Loading";

type WeightButtonProps = {
    label: string;
    weight: number;
    setWeight: (weight: number) => void;
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
    loading: boolean;
    error: boolean;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
    options: {
        language: string;
        license: string;
        minYears: number | '';
        lastUpdate: {
            years: number | '';
            months: number | '';
        };
        maxDependencies: number | '';
    }
    optionsSets: {
        setLanguage: (language: string) => void;
        setLicense: (license: string) => void;
        setMinYears: (minYears: number | "") => void;
        lastUpdateSets: {
            setYears: (lastUpdateYears: number | "") => void;
            setMonth: (lastUpdateMonths: number | "") => void;
        };
        setMaxDependencies: (maxDependencies: number | "") => void;
    }
    popularLanguageList: string[];
    notPopularLanguageList: string[];
    weights: {
        searchTermWeight: number;
        languageWeight: number;
        licenseWeight: number;
        minYearsWeight: number;
        lastUpdateWeight: number;
        maxDependenciesWeight: number;
    };
    weightSets: {
        setSearchTermWeight: (searchTermWeight: number) => void;
        setLanguageWeight: (languageWeight: number) => void;
        setLicenseWeight: (licenseWeight: number) => void;
        setMinYearsWeight: (minYearsWeight: number) => void;
        setLastUpdateWeight: (lastUpdateWeight: number) => void;
        setMaxDependenciesWeight: (maxDependencies: number) => void;
    };
};

const SearchForm: React.FC<SearchFormProps> = ({
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    loading,
    error,
    options,
    optionsSets,
    popularLanguageList,
    notPopularLanguageList,
    weights,
    weightSets,
}) => {
    return(
        <>
            {loading ? (
                <div className="flex flex-col items-center">
                    <div className="text-green-600 font-bold text-2xl mb-2">
                        Wait for Searching...
                    </div>
                    <Loading />
                </div>
            ): (
                <div className="flex flex-col items-center pt-5">
                    {error && (
                        <p className="text-red-700 text-sm mb-4">Keyword is required</p>
                    )}
                    <form
                        onSubmit={handleSearchSubmit}
                        className={`flex bg-gray-100 rounded-full px-4 py-2 mb-5 shadow-lg w-1/2 ${error ? 'border-2 border-red-700' : ''}`}
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search OSS Project by keywords ex. name, function, ..."
                            className={`bg-transparent outline-none text-gray-600 px-4 py-2 flex-grow ${error ? '' : ''}`}
                        />
                        <button type="submit" className="text-gray-500">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                    <div className="bg-gray-100 p-4 mt-8 rounded-lg shadow-md w-1/2">
                        <div className="mb-2 font-semibold">
                            Options
                        </div>
                        <p className="text-gray-500 text-sm mb-5">
                            These options allow a more detailed search
                        </p>
                        <div className="mb-4">
                            <label className="block mb-1 flex space-x-1">
                                <p className="text-gray-700">Language</p>
                                <p className="text-gray-500">(Written in or Working in)</p>
                            </label>
                            <select
                                id="language"
                                value={options.language}
                                onChange={(e) => optionsSets.setLanguage(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value='' className="text-gray-700" selected>Any language</option>
                                <optgroup label="Popular">
                                    {popularLanguageList.map((language, index) => (
                                        <option key={index} value={language}>{language}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Everything else">
                                    {notPopularLanguageList.map((language, index) => (
                                        <option key={index} value={language}>{language}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">License</label>
                            <input
                                type="text"
                                value={options.license}
                                onChange={(e) => optionsSets.setLicense(e.target.value)}
                                placeholder="Type License"
                                className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Development History</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="number"
                                    value={options.minYears}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') { // 数値が消された場合に初期状態に戻す
                                            optionsSets.setMinYears('');
                                        } else if (/^\d*$/.test(value)) { // 正の整数のみ許可
                                            optionsSets.setMinYears(Number(value));
                                        }
                                    }}
                                    placeholder="Years"
                                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                                />
                            </div>
                            <p className="text-gray-500 text-sm ml-1">Enter the minimum years (positive integer) since the project started</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Last Update</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="number"
                                    placeholder="Years"
                                    value={options.lastUpdate.years}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') { // 数値が消された場合に初期状態に戻す
                                            optionsSets.lastUpdateSets.setYears('');
                                        } else if (/^\d*$/.test(value)) { // 正の整数のみ許可
                                            optionsSets.lastUpdateSets.setYears(Number(value));
                                        }
                                    }}
                                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Months"
                                    value={options.lastUpdate.months}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') { // 数値が消された場合に初期状態に戻す
                                            optionsSets.lastUpdateSets.setMonth('');
                                        } else if (/^\d*$/.test(value)) { // 正の整数のみ許可
                                            optionsSets.lastUpdateSets.setMonth(Number(value));
                                        }
                                    }}
                                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                                />
                            </div>
                            <p className="text-gray-500 text-sm ml-1">Enter the number of years and months (positive integer) since the project was last update</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Dependencies Count</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="number"
                                    value={options.maxDependencies}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') { // 数値が消された場合に初期状態に戻す
                                            optionsSets.setMaxDependencies('');
                                        } else if (/^\d*$/.test(value)) { // 正の整数のみ許可
                                            optionsSets.setMaxDependencies(Number(value));
                                        }
                                    }}
                                    placeholder="Dependencies"
                                    className="border border-gray-300 rounded px-3 py-2 mr-2"
                                />
                            </div>
                            <p className="text-gray-500 text-sm ml-1">Enter the maximum number (positive integer) of allowed dependencies</p>
                        </div>

                        <WeightButton label="Keyword Weight" weight={weights.searchTermWeight} setWeight={weightSets.setSearchTermWeight} />
                        <WeightButton label="Language Weight" weight={weights.languageWeight} setWeight={weightSets.setLanguageWeight} />
                        <WeightButton label="License Weight" weight={weights.licenseWeight} setWeight={weightSets.setLicenseWeight} />
                        <WeightButton label="Development History Weight" weight={weights.minYearsWeight} setWeight={weightSets.setMinYearsWeight} />
                        <WeightButton label="Last Update Weight" weight={weights.lastUpdateWeight} setWeight={weightSets.setLastUpdateWeight} />
                        <WeightButton label="Dependencies Count Weight" weight={weights.maxDependenciesWeight} setWeight={weightSets.setMaxDependenciesWeight} />

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
                </div>
            )}
        </>
    )
};

export default SearchForm;