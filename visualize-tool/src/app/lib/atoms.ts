import { atom } from "recoil";

import { ProjectInfo } from "../types/ProjectInfo";
import { Filters } from "../types/Filters";

export const searchResultState = atom<ProjectInfo[]>({
    key: 'searchResult',
    default: [],
    dangerouslyAllowMutability: true,
});

export const sortCommandState = atom<string>({
    key: 'sortCommand',
    default: 'relevance',
    dangerouslyAllowMutability: true,
});

export const sortOrderState = atom<'up' | 'down'>({
    key: 'sortOrder',
    default: 'up',
    dangerouslyAllowMutability: true,
});

export const filtersState = atom<Filters>({
    key: 'filter',
    default: { license: '', language: '' },
    dangerouslyAllowMutability: true,
});
