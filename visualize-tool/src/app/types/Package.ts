import { Description } from "./Description";

export type Package = {
    [key: string]: {
        Name: string;
        Architecture: string;
        Description?: Description;
        [key: string]: any;
    };
};