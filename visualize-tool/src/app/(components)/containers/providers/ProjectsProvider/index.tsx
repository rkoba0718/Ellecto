"use client";

import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';
import { searchResultState } from '@/app/lib/atoms';
import { projectsPerPage } from './config';

type ProjectsProviderProps = {
  children: (
    result: ProjectInfo[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalProjects: number
  ) => React.ReactNode;
};

const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
    const result = useRecoilValue(searchResultState);
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * projectsPerPage;
    const currentResult = result.slice(startIndex, startIndex + projectsPerPage);

    const navigation = useRouter();

    // TODO: URL処理，戻るボタンで値の切り替え
    // URLからクエリパラメータを取得し、初期ページを設定
    // useEffect(() => {
    //   const params = new URLSearchParams(window.location.search);
    //   const skip = params.get('skip');

    //   if (skip && !isNaN(Number(skip))) {
    //     const newPage = Math.ceil(Number(skip) / projectsPerPage);
    //     setCurrentPage(newPage);
    //   }
    // }, []);

    // ページが変わるときにURLのクエリパラメータを更新
    useEffect(() => {
      const skip = (currentPage - 1) * projectsPerPage;
      navigation.push(`/projects?skip=${skip}`);
    }, [currentPage, navigation]);

    return <>{children(currentResult, currentPage, setCurrentPage, result.length)}</>
};

export default ProjectsProvider;
