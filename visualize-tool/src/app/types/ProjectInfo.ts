import { ObjectId } from "mongodb";

export type ProjectInfo = {
    _id: ObjectId;
    Name: string;
    Language: {
        [key: string]: {
            Name: string;
            Percentage: string;
        };
    };
    LOC: number;
    License: string;
    Maintainers: {
        [key: string]: {
            Name: string;
            Email: string
        };
    };
    Description: {
        summary: string;
        detail: string;
    };
    [key: string]: any;  // その他の任意フィールド
};