import { useState } from 'react';
import Seo from '../components/Seo';

const formEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || '';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
        Send a message using this form. For Formspree, set `VITE_FORMSPREE_ENDPOINT` in your `.env`.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-cyan-200/40 bg-cyan-300/10 p-5 text-cyan-100">
          Message sent. I will get back to you soon.
        </div>
      ) : null}

      <form
        action={formEndpoint || undefined}
        method={formEndpoint ? 'POST' : undefined}
        onSubmit={() => setSubmitted(true)}
        className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        {!formEndpoint ? (
          <p className="rounded-lg border border-yellow-300/40 bg-yellow-200/10 px-3 py-2 text-sm text-yellow-100">
            Form endpoint is not configured yet. Add `VITE_FORMSPREE_ENDPOINT` to enable delivery.
          </p>
        ) : null}

        <label className="block">
          <span className="text-sm text-slate-200">Name</span>
          <input
            required
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
            name="message"
            rows="6"
            className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/50 px-4 py-3 text-sm outline-none transition focus:border-cyan-300"
            placeholder="Tell me about your project"
          />
        </label>

        <button
          type="submit"
          className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
