"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';

type SelectedProjectProviderProps = {
  children: (
    loading: boolean,
    error: { status: number; message: string } | null,
    project: ProjectInfo | null,
    transitiveProjects: ProjectInfo[],
  ) => React.ReactNode;
};

const SelectedProjectProvider: React.FC<SelectedProjectProviderProps> = ({ children }) => {
  const { objectId } = useParams();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [transitiveProjects, setTransitiveProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  useEffect(() => {
    if (!objectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${objectId}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError({ status: response.status, message: errorData.message });
          return;
        }
        const data = await response.json();
        if (data === null) {
          setProject(null);
          return;
        }
        setProject(data.project);
        setTransitiveProjects(data.transitiveDependencyProjects);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError({ status: 500, message: "An unexpected error occurred." });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [objectId]);

  return <>{children(loading, error, project, transitiveProjects)}</>;
};

export default SelectedProjectProvider;
