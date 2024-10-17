import { ObjectId } from "mongodb";

export type ProjectInfo = {
    _id: ObjectId;
    Name: string;
    language: {
        [key: string]: string;
    };
    license: string;
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