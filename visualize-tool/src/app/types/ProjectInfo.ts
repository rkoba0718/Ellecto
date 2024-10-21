import { ObjectId } from "mongodb";

export type ProjectInfo = {
    _id: ObjectId;
    Name: string;
    Language: {
        [key: string]: string;
    };
    License: string;
    Maintainer: {
        Maintainer: string;
        Email: string;
    };
    Description: {
        summary: string;
        detail: string;
    };
    [key: string]: any;  // その他の任意フィールド
};