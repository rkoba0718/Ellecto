import { create } from "zustand";

// TODO: Refactoring

type SearchTermStore = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
};

export const useSearchTermStore = create<SearchTermStore>((set) => ({
	searchTerm: '',
	setSearchTerm: (searchTerm) => set({ searchTerm: searchTerm })
}));

type SearchTermWeightStore = {
	searchTermWeight: number;
	setSearchTermWeight: (searchTermWeight: number) => void;
};

export const useSearchTermWeightStore = create<SearchTermWeightStore>((set) => ({
	searchTermWeight: 1,
	setSearchTermWeight: (searchTermWeight) => set({ searchTermWeight: searchTermWeight })
}));

type LanguageStore = {
	language: string;
	setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
	language: '',
	setLanguage: (language) => set({ language: language })
}));

type LanguageWeightStore = {
	languageWeight: number;
	setLanguageWeight: (languageWeight: number) => void;
};

export const useLanguageWeightStore = create<LanguageWeightStore>((set) => ({
	languageWeight: 1,
	setLanguageWeight: (languageWeight) => set({ languageWeight: languageWeight })
}));

type LicenseStore = {
	license: string;
	setLicense: (license: string) => void;
};

export const useLicenseStore = create<LicenseStore>((set) => ({
	license: '',
	setLicense: (license) => set({ license: license })
}));

type LicenseWeightStore = {
	licenseWeight: number;
	setLicenseWeight: (licenseWeight: number) => void;
};

export const useLicenseWeightStore = create<LicenseWeightStore>((set) => ({
	licenseWeight: 1,
	setLicenseWeight: (licenseWeight) => set({ licenseWeight: licenseWeight })
}));

type MinYearsStore = {
	minYears: number | '';
	setMinYears: (minYears: number | '') => void;
};

export const useMinYearsStore = create<MinYearsStore>((set) => ({
	minYears: '',
	setMinYears: (minYears) => set({ minYears: minYears })
}));

type MinYearsWeightStore = {
	minYearsWeight: number;
	setMinYearsWeight: (minYearsWeight: number) => void;
};

export const useMinYearsWeightStore = create<MinYearsWeightStore>((set) => ({
	minYearsWeight: 1,
	setMinYearsWeight: (minYearsWeight) => set({ minYearsWeight: minYearsWeight })
}));

type LastUpdateYearsStore = {
	lastUpdateYears: number | '';
	setLastUpdateYears: (lastUpdateYears: number | '') => void;
};

export const useLastUpdateYearsStore = create<LastUpdateYearsStore>((set) => ({
	lastUpdateYears: '',
	setLastUpdateYears: (lastUpdateYears) => set({ lastUpdateYears: lastUpdateYears })
}));

type LastUpdateMonthsStore = {
	lastUpdateMonths: number | '';
	setLastUpdateMonths: (lastUpdateMonths: number | '') => void;
};

export const useLastUpdateMonthsStore = create<LastUpdateMonthsStore>((set) => ({
	lastUpdateMonths: '',
	setLastUpdateMonths: (lastUpdateMonths) => set({ lastUpdateMonths: lastUpdateMonths })
}));

type LastUpdateWeightStore = {
	lastUpdateWeight: number;
	setLastUpdateWeight: (lastUpdateWeight: number) => void;
};

export const useLastUpdateWeightStore = create<LastUpdateWeightStore>((set) => ({
	lastUpdateWeight: 1,
	setLastUpdateWeight: (lastUpdateWeight) => set({ lastUpdateWeight: lastUpdateWeight })
}));

type MaxDependenciesStore = {
	maxDependencies: number | '';
	setMaxDependencies: (maxDependencies: number | '') => void;
};

export const useMaxDependenciesStore = create<MaxDependenciesStore>((set) => ({
	maxDependencies: '',
	setMaxDependencies: (maxDependencies) => set({ maxDependencies: maxDependencies })
}));

type MaxDependenciesWeightStore = {
	maxDependenciesWeight: number;
	setMaxDependenciesWeight: (maxDependencies: number) => void;
};

export const useMaxDependenciesWeightStore = create<MaxDependenciesWeightStore>((set) => ({
	maxDependenciesWeight: 1,
	setMaxDependenciesWeight: (maxDependenciesWeight) => set({ maxDependenciesWeight: maxDependenciesWeight })
}));
