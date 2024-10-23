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
    const [showOptions, setShowOptions] = React.useState(false);
    const [result, setResult] = useRecoilState(searchResultState);

    // 各検索条件の重み
    const [searchTermWeight, setSearchTermWeight] = useState(1);
    const [languageWeight, setLanguageWeight] = useState(1);
    const [licenseWeight, setLicenseWeight] = useState(1);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm === '') {
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
            const data = await response.json();
            setResult(data);
            router.push('/projects');
        } catch (error) {
            // TODO: エラー処理
            console.log('Error searching projects:', error);
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