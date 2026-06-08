import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { getCategoryByKey } from '../data/projects';
import { useProjectQuery } from '../hooks/useProjectsQuery';

export default function ProjectDetailPage() {
  const { categoryKey, projectSlug } = useParams();
  const category = getCategoryByKey(categoryKey);
  const { project, loading, error } = useProjectQuery(categoryKey, projectSlug);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 text-slate-300 md:px-10 md:pt-14">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
        <div className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-5 text-amber-100">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
      <Seo
        title={`${project.title} Case Study`}
        description={project.shortDescription}
        path={`/${project.category}/${project.slug}`}
      />

      <Link to="/projects" className="text-sm text-cyan-200 hover:text-cyan-100">
        Back to Projects
      </Link>

      <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{project.title}</h2>
      <p className="mt-4 text-slate-300">{project.shortDescription}</p>

      <img src={project.image} alt={project.title} className="mt-8 h-72 w-full rounded-2xl border border-white/10 object-cover" loading="lazy" />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-display text-xl font-semibold">Problem</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{project.problem}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-display text-xl font-semibold">Process</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{project.process}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-display text-xl font-semibold">Results</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{project.results}</p>
        </article>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
          >
            GitHub
          </a>
        ) : null}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-cyan-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-200"
          >
            Live Demo
          </a>
        ) : null}
      </div>
    </div>
  );
}
