import { create } from "zustand";

type SortCommandStore = {
	sortCommand: string;
	setSortCommand: (command: string) => void;
};

export const useSortCommandStore = create<SortCommandStore>((set) => ({
	sortCommand: 'relevance',
	setSortCommand: (command) => set({ sortCommand: command })
}));

type SortOrderStore = {
	sortOrder: 'up' | 'down';
	setSortOrder: (order: 'up' | 'down') => void;
}

export const useSortOrderStore = create<SortOrderStore>((set) => ({
	sortOrder: 'up',
	setSortOrder: (order) => set({ sortOrder: order })
}));
