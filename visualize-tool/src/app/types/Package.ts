import { Description } from "./Description";
import { Dependency } from "./Dependency";

export type Package = {
    [key: string]: {
        Name: string;
        Architecture: string;
        Description?: Description;
        Depends?: Dependency[];
        [key: string]: any;
    };
};