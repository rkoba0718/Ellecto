import { create } from "zustand";

import { ProjectInfo } from "@/app/types/ProjectInfo";

type SearchResultStore = {
	searchResult: ProjectInfo[];
	setSearchResult: (result: ProjectInfo[]) => void;
};

export const useSearchResultStore = create<SearchResultStore>((set) => ({
	searchResult: [],
	setSearchResult: (result) => set({ searchResult: result })
}));
