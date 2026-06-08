import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { getCategoryLabel } from '../data/projects';
import { useProjectsQuery } from '../hooks/useProjectsQuery';

const profilePhoto = '/images/profile-photo.jpeg';

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
          <h2 className="max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            A curious learner building <span className="text-shimmer ml-2 inline-block">useful web experiences</span>
            <br />
            through every project.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            I learn by building real projects, improving the details, and turning ideas into clean, responsive digital products.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Profile Photo</p>
          <img src={profilePhoto} alt="Fajar profile" className="mt-4 h-64 w-full rounded-xl border border-white/10 object-cover" loading="lazy" />
          <p className="mt-3 text-xs text-slate-400">Available for web development, portfolio systems, and digital product projects.</p>
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

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Project Focus</p>
        <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Focused work, clearer story</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          I keep this portfolio focused on projects that are ready to explain: the problem, the process, and the result.
        </p>
        <Link
          to="/projects"
          className="mt-5 inline-flex rounded-full bg-cyan-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-cyan-200"
        >
          View All Projects
        </Link>
      </section>
    </div>
  );
}
