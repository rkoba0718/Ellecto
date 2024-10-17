import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

import { ProjectInfo } from "../types/ProjectInfo";

const { persistAtom } = recoilPersist();

export const searchResultState = atom<ProjectInfo[]>({
    key: 'searchResult',
    default: [],
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [persistAtom],
});