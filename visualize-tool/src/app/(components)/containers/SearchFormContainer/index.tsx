"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import {
    useSearchTermStore,
    useLanguageStore,
    useLicenseStore,
    useMinYearsStore,
    useLastUpdateYearsStore,
    useLastUpdateMonthsStore,
    useMaxDependenciesStore,
    useSearchTermWeightStore,
    useLanguageWeightStore,
    useLicenseWeightStore,
    useMinYearsWeightStore,
    useLastUpdateWeightStore,
    useMaxDependenciesWeightStore
} from "@/app/lib/stores/useSearchStore";
import { useSearchResultStore } from "@/app/lib/stores/useSearchResultStore";
import { useSortCommandStore, useSortOrderStore } from "@/app/lib/stores/useSortStore";
import { useFiltersStore } from "@/app/lib/stores/useFiltersStore";
import { popularLanguageList, notPopularLanguageList } from "@/app/constants/languageList";
import SearchForm from "../../presentationals/SearchForm";

const SearchFormContainer: React.FC = () => {
    const router = useRouter();
    const { searchTerm, setSearchTerm } = useSearchTermStore();
    const { language, setLanguage } = useLanguageStore();
    const { license, setLicense } = useLicenseStore();
    const { minYears, setMinYears } = useMinYearsStore();
    const { lastUpdateYears, setLastUpdateYears } = useLastUpdateYearsStore();
    const { lastUpdateMonths, setLastUpdateMonths } = useLastUpdateMonthsStore();
    const { maxDependencies, setMaxDependencies } = useMaxDependenciesStore();
    const setSearchResult = useSearchResultStore((state) => state.setSearchResult);
    const setSortCommand = useSortCommandStore((state) => state.setSortCommand);
    const setSortOrder = useSortOrderStore((state) => state.setSortOrder);
    const setFilters = useFiltersStore((state) => state.setFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // 各検索条件の重み
    const { searchTermWeight, setSearchTermWeight } = useSearchTermWeightStore();
    const { languageWeight, setLanguageWeight } = useLanguageWeightStore();
    const { licenseWeight, setLicenseWeight } = useLicenseWeightStore();
    const { minYearsWeight, setMinYearsWeight } = useMinYearsWeightStore();
    const { lastUpdateWeight, setLastUpdateWeight } = useLastUpdateWeightStore();
    const { maxDependenciesWeight, setMaxDependenciesWeight } = useMaxDependenciesWeightStore();

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
            setSearchResult(data);
            router.push('/projects');
        } catch (error) {
            console.log('Error searching projects:', error);
            router.push('/searchfailed');
        }
    };

    // sort，sortOrder，filterを初期化
    useEffect(() => {
        setSortCommand('relevance');
        setSortOrder('up');
        setFilters({ section: '', license: '', language: '' });
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
            popularLanguageList={popularLanguageList}
            notPopularLanguageList={notPopularLanguageList}
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