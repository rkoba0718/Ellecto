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
    totalProjects: number,
    applyFiltersAndSort: (filters: { license: string; language: string }, sort: string) => void
  ) => React.ReactNode;
};

const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const result = useRecoilValue(searchResultState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResult, setFilteredResult] = useState<ProjectInfo[]>(result);
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState({ license: '', language: '' });
  const navigation = useRouter();

  // フィルタとソートの適用
  const applyFiltersAndSort: (filters: { license: string; language: string }, sort: string) => void = (filters: { license: string; language: string }, sort: string) => {
    const filtered = result
      .filter(project =>
        (filters.license ? project.License.toLowerCase().includes(filters.license.toLowerCase()) : true) &&
        (filters.language
          ? (
            project.Language.Lang1.Name.toLowerCase().includes(filters.language.toLowerCase()) ||
            project.Description.summary.toLowerCase().includes(filters.language.toLowerCase()) ||
            project.Description.detail.toLowerCase().includes(filters.language.toLowerCase())
          )
          : true
        )
      )
      .sort((a, b) => {
          if (sort === 'name') return a.Name.localeCompare(b.Name);
          return b.score - a.score; // Relevance（デフォルト）
      });

    setFilteredResult(filtered);
    setCurrentPage(1); // フィルタ・ソート変更時にページを1にリセット
  };

  // 初期表示でフィルタリングとソートを適用
  useEffect(() => {
    applyFiltersAndSort(filters, sort);
  }, [filters, sort, result]);


  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentResult = filteredResult.slice(startIndex, startIndex + projectsPerPage);

  useEffect(() => {
    const skip = (currentPage - 1) * projectsPerPage;
    navigation.push(`/projects?skip=${skip}`);
  }, [currentPage, navigation]);

  return <>{children(currentResult, currentPage, setCurrentPage, filteredResult.length, applyFiltersAndSort)}</>
};

export default ProjectsProvider;
