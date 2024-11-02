import { ObjectId } from "mongodb";

import { Language } from "./Language";
import { Description } from "./Description";
import { Package } from "./Package";

export type ProjectInfo = {
    _id: ObjectId;
    Name: string;
    Language: Language;
    LOC: number;
    License: string;
    Maintainers: {
        [key: string]: {
            Name: string;
            Email: string
        };
    };
    Description: Description;
    Package: Package;
    [key: string]: any;  // その他の任意フィールド
};