"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';

type SelectedProjectProviderProps = {
  children: (project: ProjectInfo | null) => React.ReactNode;
};

const SelectedProjectProvider: React.FC<SelectedProjectProviderProps> = ({ children }) => {
  const { objectId } = useParams();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!objectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${objectId}`);
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [objectId]);

  // TODO: Loading表示
  if (loading) {
    return <div>Loading...</div>;
  }

  // TODO: Error表示
  if (error || !project) {
    return <div>Failed to load project data.</div>;
  }

  return <>{children(project)}</>;
};

export default SelectedProjectProvider;
