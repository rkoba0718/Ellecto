import { ObjectId } from "mongodb";

import { Language } from "./Language";
import { Description } from "./Description";

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
    Package: {
        [key: string]: {
            Name: string;
            Description?: {
                summary: string;
                detail: string;
            };
            [key: string]: any;
        };
    }
    [key: string]: any;  // その他の任意フィールド
};