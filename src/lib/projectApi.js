import { supabase } from './supabase';
import { buildStoragePath, optimizeImage } from './imageUpload';

const TABLE_NAME = 'projects';
const BUCKET_NAME = 'project-images';

function mapRowToProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    shortDescription: row.short_description,
    tech: row.tech ?? [],
    image: row.image_url,
    github: row.github_url,
    live: row.live_url,
    featured: row.featured,
    problem: row.problem,
    process: row.process,
    results: row.results,
    updatedAt: row.updated_at
  };
}

function mapProjectToPayload(project) {
  return {
    slug: project.slug,
    category: project.category,
    title: project.title,
    short_description: project.shortDescription,
    tech: Array.isArray(project.tech)
      ? project.tech
      : String(project.tech ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    image_url: project.image,
    github_url: project.github || null,
    live_url: project.live || null,
    featured: Boolean(project.featured),
    problem: project.problem || '',
    process: project.process || '',
    results: project.results || ''
  };
}

function baseProjectSelect() {
  return `
    id,
    slug,
    category,
    title,
    short_description,
    tech,
    image_url,
    github_url,
    live_url,
    featured,
    problem,
    process,
    results,
    updated_at
  `;
}

export async function fetchProjects({ categoryKey, featuredOnly } = {}) {
  let query = supabase
    .from(TABLE_NAME)
    .select(baseProjectSelect())
    .order('featured', { ascending: false })
    .order('updated_at', { ascending: false });

  if (categoryKey) {
    query = query.eq('category', categoryKey);
  }

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToProject);
}

export async function fetchProject(categoryKey, projectSlug) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(baseProjectSelect())
    .eq('category', categoryKey)
    .eq('slug', projectSlug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapRowToProject(data) : null;
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(mapProjectToPayload(project))
    .select(baseProjectSelect())
    .single();

  if (error) {
    throw error;
  }

  return mapRowToProject(data);
}

export async function updateProject(id, project) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(mapProjectToPayload(project))
    .eq('id', id)
    .select(baseProjectSelect())
    .single();

  if (error) {
    throw error;
  }

  return mapRowToProject(data);
}

export async function removeProject(id) {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function uploadProjectImage(file, slug) {
  const optimizedFile = await optimizeImage(file);
  const storagePath = buildStoragePath(slug, optimizedFile);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, optimizedFile, { upsert: false, cacheControl: '31536000' });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data.publicUrl;
}
