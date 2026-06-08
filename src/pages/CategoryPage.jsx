import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { getCategoryByKey } from '../data/projects';
import { useProjectsQuery } from '../hooks/useProjectsQuery';

function cardAnimation(index) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.35, delay: index * 0.06 }
  };
}

export default function CategoryPage() {
  const { categoryKey } = useParams();
  const category = getCategoryByKey(categoryKey);
  const { projects: list, loading, error } = useProjectsQuery({ categoryKey });

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
      <Seo title={category.title} description={category.summary} path={category.path} />

      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Project Category</p>
      <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{category.title}</h2>
      <p className="mt-4 max-w-2xl text-slate-300">{category.summary}</p>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
            Loading projects...
          </div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-5 text-amber-100">
            {error}
          </div>
        ) : null}
        {list.map((project, index) => (
          <motion.article
            key={project.slug}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            {...cardAnimation(index)}
          >
            <img src={project.image} alt={project.title} className="h-52 w-full object-cover" loading="lazy" />
            <div className="p-5">
              <h3 className="font-display text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{project.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
                  >
                    GitHub
                  </a>
                ) : null}
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-200"
                  >
                    Live Demo
                  </a>
                ) : null}
              </div>
              <Link to={`/${project.category}/${project.slug}`} className="mt-5 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">
                Read Case Study
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
