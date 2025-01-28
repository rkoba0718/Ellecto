import { create } from "zustand";

import { Filters } from "@/app/types/Filters";

type FiltersStore = {
	filters: Filters;
	setFilters: (filters: Filters) => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
	filters: { license: '', language: '' },
	setFilters: (filters) => set({ filters: filters })
}));
