"use client";

import React from "react";

import { Language } from "@/app/types/Language";
import LanguageInfo from "@/app/(components)/presentationals/projects/shows/LanguageInfo";

const colors = [
    "#FF0000", // 🟥
    "#007BFF", // 🟦
    "#FFA233", // 🟧
    "#00FF00", // 🟩
    "#85FF33", // 🟩（黄緑）
    "#9E33FF", // 🟪
    "#FF33A1", // 🟫
    "#33FFDA", // 🟦（シアン）
    "#002F6C", // 🟦（紺）
];

type LanguageInfoContainerProps = {
    language: Language;
    loc: number;
};

const LanguageInfoContainer: React.FC<LanguageInfoContainerProps> = ({
    language,
    loc
}) => {
    const assignedColors = new Set<string>();  // 色の重複を防ぐためのセット

    const getRandomColor = () => {
        let color;
        do {
            color = colors[Math.floor(Math.random() * colors.length)];
        } while (assignedColors.has(color) && assignedColors.size < colors.length); // 重複回避
        assignedColors.add(color);
        return color;
    };

    const data = Object.keys(language).map((key) => {
        const isOther = language[key].Name === "Other";
        const color = isOther ? "#D3D3D3" : getRandomColor();  // "Other" は常に灰色，それ以外の色は0~8のランダム値によって，colorsを参照し決定
        return {
            name: language[key].Name,
            percentage: parseFloat(language[key].Percentage),
            color: color
        };
    });

    return <LanguageInfo data={data} loc={loc} />;
};

export default LanguageInfoContainer;