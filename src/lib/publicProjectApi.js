import { supabaseAnonKey, supabaseUrl } from './supabaseConfig';

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

function buildUrl(path, query) {
  const url = new URL(`${supabaseUrl}/rest/v1/${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function request(path, query) {
  const response = await fetch(buildUrl(path, query), {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch project data.');
  }

  return response.json();
}

export async function fetchPublicProjects({ categoryKey, featuredOnly } = {}) {
  const query = {
    select:
      'id,slug,category,title,short_description,tech,image_url,github_url,live_url,featured,updated_at',
    order: 'featured.desc,updated_at.desc'
  };

  if (categoryKey) {
    query.category = `eq.${categoryKey}`;
  }

  if (featuredOnly) {
    query.featured = 'eq.true';
  }

  const rows = await request('projects', query);
  return rows.map(mapRowToProject);
}

export async function fetchPublicProject(categoryKey, slug) {
  const rows = await request('projects', {
    select:
      'id,slug,category,title,short_description,tech,image_url,github_url,live_url,featured,problem,process,results,updated_at',
    category: `eq.${categoryKey}`,
    slug: `eq.${slug}`,
    limit: '1'
  });

  return rows[0] ? mapRowToProject(rows[0]) : null;
}
