import { atom } from "recoil";

import { ProjectInfo } from "../types/ProjectInfo";

export const searchResultState = atom<ProjectInfo[]>({
    key: 'searchResult',
    default: [],
    dangerouslyAllowMutability: true,
});