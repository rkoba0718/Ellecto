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
    Package: {
        [key: string]: {
            Name: string;
            Description: {
                summary: string;
                detail: string;
            };
            [key: string]: any;
        };
    }
    [key: string]: any;  // その他の任意フィールド
};