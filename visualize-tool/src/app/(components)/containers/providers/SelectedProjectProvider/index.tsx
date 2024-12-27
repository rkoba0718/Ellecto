"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ProjectInfo } from '@/app/types/ProjectInfo';
import { Error } from '@/app/types/Error';

type SelectedProjectProviderProps = {
  children: (
    loading: boolean,
    error: Error | null,
    project: ProjectInfo | null,
  ) => React.ReactNode;
};

const SelectedProjectProvider: React.FC<SelectedProjectProviderProps> = ({ children }) => {
  const { objectId } = useParams();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError({ status: 500, message: "An unexpected error occurred." });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [objectId]);

  return <>{children(loading, error, project)}</>;
};

export default SelectedProjectProvider;
