import Seo from '../components/Seo';

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'you@example.com';
const githubUrl = 'https://github.com/your-username';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
      <Seo
        title="Contact"
        description="Contact me for freelance projects, collaborations, or full-time opportunities."
        path="/contact"
      />

      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Contact</p>
      <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">Let's Work Together</h2>
      <p className="mt-4 text-slate-300">
        Have a project, collaboration, or opportunity in mind? Feel free to reach me directly by email.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-200/80">Email</p>
        <a href={`mailto:${contactEmail}`} className="mt-2 block text-lg font-semibold text-white transition hover:text-cyan-100">
          {contactEmail}
        </a>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Email Me
          </a>
          <a
            href={githubUrl}
            className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/50 hover:text-cyan-100"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
