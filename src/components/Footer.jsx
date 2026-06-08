export default function Footer() {
  return (
    <footer className="mx-6 mb-6 mt-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md md:mx-10">
      <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>Copyright {new Date().getFullYear()} Renz. Replace this text with your own footer details.</p>
        <div className="flex gap-4">
          <a className="text-cyan-200 transition hover:text-cyan-100" href="https://github.com/your-username" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="text-cyan-200 transition hover:text-cyan-100" href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="text-cyan-200 transition hover:text-cyan-100" href="mailto:you@email.com">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
