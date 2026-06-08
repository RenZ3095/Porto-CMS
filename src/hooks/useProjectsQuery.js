import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseConfig';
import { fetchPublicProject, fetchPublicProjects } from '../lib/publicProjectApi';
import { getProjectBySlug, getProjectsByCategory, localProjects, seedProjects } from '../data/projects';

const missingConfigError =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
const offlineError =
  'Supabase is unreachable, so cached or demo projects are being shown. Check VITE_SUPABASE_URL and your network.';
const cachePrefix = 'portfolio-projects:v1';
const cacheMaxAge = 5 * 60 * 1000;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readCache(key) {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const cached = window.localStorage.getItem(`${cachePrefix}:${key}`);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > cacheMaxAge) {
      window.localStorage.removeItem(`${cachePrefix}:${key}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      `${cachePrefix}:${key}`,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    );
  } catch {
    // Ignore storage quota and privacy-mode failures.
  }
}

export function clearProjectCache() {
  if (!canUseStorage()) {
    return;
  }

  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(cachePrefix))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage access failures.
  }
}

function projectsCacheKey({ categoryKey = 'all', featuredOnly = false } = {}) {
  return `list:${categoryKey}:${featuredOnly ? 'featured' : 'all'}`;
}

function projectCacheKey(categoryKey, projectSlug) {
  return `detail:${categoryKey}:${projectSlug}`;
}

function getSeedProject(categoryKey, projectSlug) {
  return getProjectBySlug(categoryKey, projectSlug, seedProjects) ?? null;
}

function getSeedProjects({ categoryKey, featuredOnly } = {}) {
  let projects = categoryKey ? getProjectsByCategory(categoryKey, seedProjects) : seedProjects;

  if (featuredOnly) {
    projects = projects.filter((project) => project.featured);
  }

  return projects;
}

function getLocalProjects({ categoryKey, featuredOnly } = {}) {
  let projects = categoryKey ? getProjectsByCategory(categoryKey, localProjects) : localProjects;

  if (featuredOnly) {
    projects = projects.filter((project) => project.featured);
  }

  return projects;
}

function mergeLocalProjects(projects, options = {}) {
  const existingKeys = new Set(projects.map((project) => `${project.category}:${project.slug}`));
  const missingLocalProjects = getLocalProjects(options).filter(
    (project) => !existingKeys.has(`${project.category}:${project.slug}`)
  );

  return [...missingLocalProjects, ...projects];
}

export function useProjectsQuery(options = {}) {
  const cacheKey = projectsCacheKey(options);
  const [projects, setProjects] = useState(() =>
    mergeLocalProjects(readCache(cacheKey) ?? getSeedProjects(options), options)
  );
  const [loading, setLoading] = useState(() => !readCache(cacheKey));
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const cachedProjects = readCache(cacheKey);

    if (cachedProjects) {
      setProjects(mergeLocalProjects(cachedProjects, options));
      setLoading(false);
    }

    async function load() {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setProjects(getSeedProjects(options));
          setError(missingConfigError);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(!cachedProjects);
        setError('');
        const result = await fetchPublicProjects(options);
        if (isMounted) {
          const mergedProjects = mergeLocalProjects(result, options);
          setProjects(mergedProjects);
          writeCache(cacheKey, mergedProjects);
        }
      } catch (loadError) {
        if (isMounted) {
          const fallbackProjects = cachedProjects ?? getSeedProjects(options);
          setProjects(mergeLocalProjects(fallbackProjects, options));
          setError(cachedProjects ? '' : offlineError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, options.categoryKey, options.featuredOnly, options.reloadKey]);

  return { projects, loading, error };
}

export function useProjectQuery(categoryKey, projectSlug) {
  const cacheKey = projectCacheKey(categoryKey, projectSlug);
  const [project, setProject] = useState(
    () => readCache(cacheKey) ?? getSeedProject(categoryKey, projectSlug)
  );
  const [loading, setLoading] = useState(() => !readCache(cacheKey));
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const cachedProject = readCache(cacheKey);

    if (cachedProject) {
      setProject(cachedProject);
      setLoading(false);
    }

    async function load() {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setProject(getSeedProject(categoryKey, projectSlug));
          setError(missingConfigError);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(!cachedProject);
        setError('');
        const result = await fetchPublicProject(categoryKey, projectSlug);
        if (isMounted) {
          const nextProject = result ?? getSeedProject(categoryKey, projectSlug);
          setProject(nextProject);
          if (nextProject) {
            writeCache(cacheKey, nextProject);
          }
        }
      } catch (loadError) {
        if (isMounted) {
          const fallbackProject =
            cachedProject ?? getSeedProject(categoryKey, projectSlug);
          setProject(fallbackProject);
          setError(cachedProject ? '' : offlineError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, categoryKey, projectSlug]);

  return { project, loading, error };
}
