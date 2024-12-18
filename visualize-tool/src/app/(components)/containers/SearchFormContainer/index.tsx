"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useRecoilState, useSetRecoilState } from "recoil";
import { searchResultState, sortCommandState, filtersState, sortOrderState } from "@/app/lib/atoms";

import SearchForm from "../../presentationals/SearchForm";

const SearchFormContainer: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [language, setLanguage] = useState('');
    const [license, setLicense] = useState('');
    const [minYears, setMinYears] = useState<number | ''>('');
    const [lastUpdateYears, setLastUpdateYears] = useState<number | ''>('');
    const [lastUpdateMonths, setLastUpdateMonths] = useState<number | ''>('');
    const [maxDependencies, setMaxDependencies] = useState<number | ''>('');
    const [result, setResult] = useRecoilState(searchResultState);
    const setSort = useSetRecoilState(sortCommandState);
    const setSortOrder = useSetRecoilState(sortOrderState);
    const setFilters = useSetRecoilState(filtersState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // 各検索条件の重み
    const [searchTermWeight, setSearchTermWeight] = useState(1);
    const [languageWeight, setLanguageWeight] = useState(1);
    const [licenseWeight, setLicenseWeight] = useState(1);
    const [minYearsWeight, setMinYearsWeight] = useState(1);
    const [lastUpdateWeight, setLastUpdateWeight] = useState(1);
    const [maxDependenciesWeight, setMaxDependenciesWeight] = useState(1);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm === '') {
            setError(true);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    searchTerm,
                    language,
                    license,
                    minYears,
                    lastUpdateYears,
                    lastUpdateMonths,
                    maxDependencies,
                    weight: {
                        searchTerm: searchTermWeight,
                        language: languageWeight,
                        license: licenseWeight,
                        minYears: minYearsWeight,
                        lastUpdateMonths: lastUpdateWeight,
                        maxDependencies: maxDependenciesWeight
                    }
                })
            });
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setResult(data);
            router.push('/projects');
        } catch (error) {
            console.log('Error searching projects:', error);
            router.push('/searchfailed');
        }
    };

    // sort，sortOrder，filterを初期化
    useEffect(() => {
        setSort('relevance');
        setSortOrder('up');
        setFilters({ license: '', language: '' });
    },[]);

    return (
        <SearchForm
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchSubmit={handleSearchSubmit}
            options={{
                language: language,
                license: license,
                minYears: minYears,
                lastUpdate: {
                    years: lastUpdateYears,
                    months: lastUpdateMonths
                },
                maxDependencies: maxDependencies
            }}
            optionsSets={{
                setLanguage: setLanguage,
                setLicense: setLicense,
                setMinYears: setMinYears,
                lastUpdateSets: {
                    setYears: setLastUpdateYears,
                    setMonth: setLastUpdateMonths
                },
                setMaxDependencies: setMaxDependencies
            }}
            weights={{
                searchTermWeight: searchTermWeight,
                languageWeight: languageWeight,
                licenseWeight: licenseWeight,
                minYearsWeight: minYearsWeight,
                lastUpdateWeight: lastUpdateWeight,
                maxDependenciesWeight: maxDependenciesWeight
            }}
            weightSets={{
                setSearchTermWeight: setSearchTermWeight,
                setLanguageWeight: setLanguageWeight,
                setLicenseWeight: setLicenseWeight,
                setMinYearsWeight: setMinYearsWeight,
                setLastUpdateWeight: setLastUpdateWeight,
                setMaxDependenciesWeight: setMaxDependenciesWeight
            }}
        />
    )
};

export default SearchFormContainer;