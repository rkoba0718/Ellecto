"use client";

import React, { useState } from "react";
import SearchForm from "../../presentationals/SearchForm";

const SearchFormContainer: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [language, setLanguage] = useState('');
    const [license, setLicense] = useState('');
    const [showOptions, setShowOptions] = React.useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search Term:", searchTerm);
        console.log("Language:", language);
        console.log("License:", license);
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
        />
    )
};

export default SearchFormContainer;