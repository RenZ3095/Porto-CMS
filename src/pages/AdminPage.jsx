import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { categories, getCategoryLabel } from '../data/projects';
import {
  createProject,
  fetchProjects,
  removeProject,
  updateProject,
  uploadProjectImage
} from '../lib/projectApi';
import { ADMIN_ROUTE_PATH } from '../lib/routes';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { clearProjectCache } from '../hooks/useProjectsQuery';

const emptyForm = {
  id: null,
  slug: '',
  category: categories[0].key,
  title: '',
  shortDescription: '',
  tech: '',
  image: '',
  github: '',
  live: '',
  featured: false,
  problem: '',
  process: '',
  results: ''
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapProjectToForm(project) {
  return {
    ...project,
    tech: Array.isArray(project.tech) ? project.tech.join(', ') : '',
    id: project.id ?? null
  };
}

function SetupNotice() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-8 md:px-10 md:pt-10">
      <Seo title="Admin" description="Supabase setup required for the admin dashboard." path={ADMIN_ROUTE_PATH} />
      <div className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-6 text-amber-100">
        <h2 className="font-display text-3xl font-semibold text-white">Supabase setup required</h2>
        <p className="mt-3 text-sm leading-6">
          Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment before using
          the real admin dashboard.
        </p>
        <p className="mt-3 text-sm leading-6">
          After that, run the SQL in `supabase/schema.sql`, create one admin user in Supabase Auth,
          and set that user&apos;s `app_metadata.is_admin` to `true`.
        </p>
      </div>
    </div>
  );
}

function LoginPanel({ onLogin, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto max-w-xl px-6 pb-16 pt-8 md:px-10 md:pt-10">
      <Seo title="Admin Login" description="Secure admin login for the portfolio dashboard." path={ADMIN_ROUTE_PATH} />

      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Private Area</p>
      <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Admin Login</h2>
      <p className="mt-4 text-slate-300">
        Sign in with your Supabase Auth admin account to manage projects and uploads.
      </p>

      <form onSubmit={(event) => onLogin(event, email, password)} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <label className="block">
          <span className="text-sm text-slate-200">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="you@email.com"
            required
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-slate-200">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="Your admin password"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: sessionLoading, isAuthenticated } = useSupabaseSession();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function loadProjects() {
    try {
      setLoadingProjects(true);
      setError('');
      const nextProjects = await fetchProjects();
      setProjects(nextProjects);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load projects.');
    } finally {
      setLoadingProjects(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setProjects([]);
      setLoadingProjects(false);
    }
  }, [isAuthenticated]);

  function updateField(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === 'title' && !editingId) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleLogin(event, email, password) {
    event.preventDefault();
    try {
      setAuthLoading(true);
      setError('');
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        throw signInError;
      }
    } catch (loginError) {
      setError(loginError.message || 'Failed to sign in.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function handleNew() {
    setEditingId(null);
    setImageFile(null);
    setForm(emptyForm);
  }

  function handleEdit(project) {
    setEditingId(project.id);
    setImageFile(null);
    setForm(mapProjectToForm(project));
  }

  async function handleDelete(id) {
    try {
      setError('');
      await removeProject(id);
      clearProjectCache();
      if (editingId === id) {
        handleNew();
      }
      await loadProjects();
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete the project.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      let imageUrl = form.image;
      const finalSlug = slugify(form.slug || form.title);

      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile, finalSlug);
      }

      if (!imageUrl) {
        throw new Error('Upload an image or provide an image URL before saving.');
      }

      const payload = {
        ...form,
        slug: finalSlug,
        image: imageUrl
      };

      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }

      clearProjectCache();
      await loadProjects();
      handleNew();
    } catch (submitError) {
      setError(submitError.message || 'Failed to save the project.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isSupabaseConfigured) {
    return <SetupNotice />;
  }

  if (sessionLoading) {
    return (
      <div className="mx-auto max-w-xl px-6 pb-16 pt-8 text-slate-300 md:px-10 md:pt-10">
        Loading admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPanel onLogin={handleLogin} loading={authLoading} error={error} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10 md:pt-10">
      <Seo title="Admin" description="Manage portfolio projects with Supabase CRUD and uploads." path={ADMIN_ROUTE_PATH} />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Private Area</p>
          <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Project Dashboard</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Signed in as {user.email}. This dashboard writes directly to Supabase and uploads images
            from your device into Storage.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleNew}
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
          >
            New Project
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-300/30 bg-rose-300/10 p-4 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold">Projects</h3>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {loadingProjects ? 'Loading...' : `${projects.length} items`}
            </span>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <article key={project.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg font-semibold text-white">{project.title}</h4>
                      {project.featured ? (
                        <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {getCategoryLabel(project.category)}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{project.shortDescription}</p>
                    <p className="mt-2 text-xs text-slate-500">/{project.category}/{project.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="rounded-full bg-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-display text-2xl font-semibold">
            {editingId ? 'Edit Project' : 'Create Project'}
          </h3>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm text-slate-200">Title</span>
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="Project title"
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-200">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                  placeholder="project-slug"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-200">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                >
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-200">Short Description</span>
              <textarea
                value={form.shortDescription}
                onChange={(event) => updateField('shortDescription', event.target.value)}
                rows="3"
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="Short card description"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Tech Stack</span>
              <input
                value={form.tech}
                onChange={(event) => updateField('tech', event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="React, Tailwind, Node.js"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Upload project image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="mt-2 block w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-slate-950"
              />
              <p className="mt-2 text-xs text-slate-400">
                Images are optimized in the browser before upload to keep the site fast.
              </p>
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Current image URL</span>
              <input
                value={form.image}
                onChange={(event) => updateField('image', event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="Filled automatically after upload, or paste a URL"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-200">GitHub URL</span>
                <input
                  value={form.github}
                  onChange={(event) => updateField('github', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                  placeholder="https://github.com/..."
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-200">Live URL</span>
                <input
                  value={form.live}
                  onChange={(event) => updateField('live', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                  placeholder="https://your-domain.com/..."
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => updateField('featured', event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-slate-200">Show in featured projects</span>
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Problem</span>
              <textarea
                value={form.problem}
                onChange={(event) => updateField('problem', event.target.value)}
                rows="3"
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="What problem did this project solve?"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Process</span>
              <textarea
                value={form.process}
                onChange={(event) => updateField('process', event.target.value)}
                rows="3"
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="How did you approach the project?"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-200">Results</span>
              <textarea
                value={form.results}
                onChange={(event) => updateField('results', event.target.value)}
                rows="3"
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
                placeholder="What was the outcome?"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={handleNew}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
