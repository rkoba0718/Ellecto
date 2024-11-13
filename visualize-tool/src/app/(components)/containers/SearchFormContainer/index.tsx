"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useRecoilState } from "recoil";
import { searchResultState } from "@/app/lib/atoms";

import SearchForm from "../../presentationals/SearchForm";

const SearchFormContainer: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [language, setLanguage] = useState('');
    const [license, setLicense] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [result, setResult] = useRecoilState(searchResultState);
    const [error, setError] = useState(false);

    // 各検索条件の重み
    const [searchTermWeight, setSearchTermWeight] = useState(1);
    const [languageWeight, setLanguageWeight] = useState(1);
    const [licenseWeight, setLicenseWeight] = useState(1);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm === '') {
            setError(true);
            return;
        }

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    searchTerm,
                    language,
                    license,
                    weight: {
                        searchTerm: searchTermWeight,
                        language: languageWeight,
                        license: licenseWeight
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

    const onToggleOptionsClick = () => {
        setShowOptions(!showOptions);
    };

    return (
        <SearchForm
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchSubmit={handleSearchSubmit}
            error={error}
            language={language}
            setLanguage={setLanguage}
            license={license}
            setLicense={setLicense}
            showOptions={showOptions}
            onToggleOptionsClick={onToggleOptionsClick}
            searchTermWeight={searchTermWeight}
            setSearchTermWeight={setSearchTermWeight}
            languageWeight={languageWeight}
            setLanguageWeight={setLanguageWeight}
            licenseWeight={licenseWeight}
            setLicenseWeight={setLicenseWeight}
        />
    )
};

export default SearchFormContainer;