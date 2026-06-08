import { useState } from 'react';
import Seo from '../components/Seo';

const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'you@example.com';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const isFormReady = Boolean(formEndpoint);

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
        Have an idea, project, or collaboration in mind? Send a message and I will get back to you.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-cyan-200/40 bg-cyan-300/10 p-5 text-cyan-100">
          Message sent. I will get back to you soon.
        </div>
      ) : null}

      {!isFormReady ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm leading-6 text-slate-300">
            The contact form is not connected yet. You can still reach me directly by email.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Email Me
          </a>
        </div>
      ) : null}

      <form
        action={formEndpoint}
        method="POST"
        onSubmit={() => setSubmitted(true)}
        className={`${isFormReady ? 'mt-8' : 'mt-6 opacity-60'} space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6`}
      >
        <label className="block">
          <span className="text-sm text-slate-200">Name</span>
          <input
            required
            disabled={!isFormReady}
            name="name"
            type="text"
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-200">Email</span>
          <input
            required
            disabled={!isFormReady}
            name="email"
            type="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="you@email.com"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-200">Message</span>
          <textarea
            required
            disabled={!isFormReady}
            name="message"
            rows="6"
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="Tell me about your project"
          />
        </label>

        <button
          type="submit"
          disabled={!isFormReady}
          className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
