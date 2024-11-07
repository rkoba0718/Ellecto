"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';

type SelectedProjectProviderProps = {
  children: (
    loading: boolean,
    project: ProjectInfo | null,
    transitiveProjects: ProjectInfo[],
  ) => React.ReactNode;
};

const SelectedProjectProvider: React.FC<SelectedProjectProviderProps> = ({ children }) => {
  const { objectId } = useParams();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [transitiveProjects, setTransitiveProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!objectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${objectId}`);
        const data = await response.json();
        if (data === null) {
          setProject(null);
          return;
        }
        setProject(data.project);
        setTransitiveProjects(data.transitiveDependencyProjects);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [objectId]);

  // TODO: Error表示
  if (error) {
    return <div>Failed to load project data.</div>;
  }

  return <>{children(loading, project, transitiveProjects)}</>;
};

export default SelectedProjectProvider;
