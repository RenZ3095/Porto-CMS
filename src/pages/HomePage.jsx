import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { categories, getCategoryLabel, testimonials } from '../data/projects';
import { useProjectsQuery } from '../hooks/useProjectsQuery';

const profilePhoto = '/images/profile-placeholder.webp';

function cardAnimation(index) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.22 },
    transition: { duration: 0.35, delay: index * 0.06 }
  };
}

export default function HomePage() {
  const { projects: featuredProjects, loading, error } = useProjectsQuery({ featuredOnly: true });

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
      <Seo
        title="Home"
        description="Modern portfolio of UI/UX, web app, and full-stack projects."
        path="/"
      />

      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">Modern Web Portfolio</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            I create <span className="text-shimmer ml-2 inline-block">modern digital products</span>
            <br />
            from concept to launch.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Explore featured work, browse categories, and open detailed project case studies.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Profile Photo</p>
          <img src={profilePhoto} alt="Profile placeholder" className="mt-4 h-64 w-full rounded-xl border border-white/10 object-cover" loading="lazy" />
          <p className="mt-3 text-xs text-slate-400">Replace `profilePhoto` in `HomePage.jsx` with your own image.</p>
        </div>
      </header>

      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold md:text-3xl">Featured Projects</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Handpicked</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
              Loading featured projects...
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-amber-300/30 bg-amber-200/10 p-5 text-amber-100">
              {error}
            </div>
          ) : null}
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              {...cardAnimation(index)}
            >
              <img src={project.image} alt={project.title} className="h-48 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-100">
                    Featured
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    {getCategoryLabel(project.category)}
                  </span>
                </div>
                <h4 className="font-display text-xl font-semibold">{project.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{project.shortDescription}</p>
                <Link
                  to={`/${project.category}/${project.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  View Case Study
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="font-display text-2xl font-semibold md:text-3xl">Browse Categories</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div key={category.key} {...cardAnimation(index)}>
              <Link
                to={category.path}
                className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Category</p>
                <h4 className="mt-2 font-display text-xl font-semibold">{category.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{category.summary}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="font-display text-2xl font-semibold md:text-3xl">Testimonials</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
              {...cardAnimation(index)}
            >
              <p className="text-sm leading-6 text-slate-200">"{item.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-cyan-100">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.role}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
