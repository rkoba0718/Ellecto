"use client";

import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useRouter } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';
import { Filters } from '@/app/types/Filters';
import { searchResultState, sortCommandState, filtersState } from '@/app/lib/atoms';
import { projectsPerPage } from './config';

type ProjectsProviderProps = {
  children: (
    result: ProjectInfo[],
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalProjects: number,
    sort: string,
    filters: Filters,
    applyFiltersAndSort: (filters: Filters, sort: string, sortOrder: string) => void
  ) => React.ReactNode;
};

const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const result = useRecoilValue(searchResultState);
  const [sort, setSort] = useRecoilState(sortCommandState);
  const [filters, setFilters] = useRecoilState(filtersState);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResult, setFilteredResult] = useState<ProjectInfo[]>(result);
  const navigation = useRouter();

  // フィルタとソートの適用
  const applyFiltersAndSort: (filters: { license: string; language: string }, sort: string, sortOrder: string) => void = (
    filters: { license: string; language: string },
    sort: string,
    sortOrder: string
  ) => {
    setFilters(filters);
    setSort(sort);
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
        const order = sortOrder === 'up' ? 1 : -1;
        if (sort === 'name') {
          return order * a.Name.localeCompare(b.Name);
        } else if (sort === 'history') {
          // FirstCommitDateが古い順、nullは後ろ
          const dateA = a.FirstCommitDate ? new Date(a.FirstCommitDate) : new Date(9999, 12, 31);
          const dateB = b.FirstCommitDate ? new Date(b.FirstCommitDate) : new Date(9999, 12, 31);
          return order * (dateA.getTime() - dateB.getTime());
        } else if (sort === 'update') {
          // LastCommitDateが最近順、nullは後ろ
          const dateA = a.LastCommitDate ? new Date(a.LastCommitDate) : new Date(0);
          const dateB = b.LastCommitDate ? new Date(b.LastCommitDate) : new Date(0);
          return order * (dateB.getTime() - dateA.getTime());
        } else if (sort === 'dependencies') {
          return order * (a['NumberOfBuild-Depends'] - b['NumberOfBuild-Depends']);
        } else {
          return order * (b.score - a.score); // Relevance（デフォルト）
        }
      });

    setFilteredResult(filtered);
    setCurrentPage(1); // フィルタ・ソート変更時にページを1にリセット
  };

  // 初期表示でフィルタリングとソートを適用
  useEffect(() => {
    applyFiltersAndSort(filters, sort, 'up');
  }, [filters, sort, result]);


  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentResult = filteredResult.slice(startIndex, startIndex + projectsPerPage);

  useEffect(() => {
    const skip = (currentPage - 1) * projectsPerPage;
    navigation.push(`/projects?skip=${skip}`);
  }, [currentPage, navigation]);

  return <>{children(currentResult, currentPage, setCurrentPage, filteredResult.length, sort, filters, applyFiltersAndSort)}</>
};

export default ProjectsProvider;
