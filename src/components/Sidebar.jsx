import { NavLink } from 'react-router-dom';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M6.5 10.5V20h11V10.5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M14 4l-4 16" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M4 6h16v12H4z" />
      <path d="M4 8l8 5 8-5" />
    </svg>
  );
}

const cvUrl = import.meta.env.VITE_CV_URL;

export default function Sidebar() {
  const menuItems = [
    { label: 'Home', to: '/', icon: <HomeIcon /> },
    { label: 'Projects', to: '/projects', icon: <CodeIcon /> },
    { label: 'Contact', to: '/contact', icon: <ContactIcon /> }
  ];

  return (
    <aside className="sticky top-0 z-20 flex h-auto w-full flex-col items-start gap-4 border-b border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:h-screen md:w-72 md:flex-col md:items-start md:justify-start md:border-b-0 md:border-r md:px-6 md:py-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Renz Portfolio</p>
        <h1 className="mt-1 font-display text-lg font-semibold text-white md:text-xl">Creative Developer</h1>
      </div>

      <nav className="mt-0 flex w-full justify-between gap-2 overflow-x-auto pb-1 sm:w-auto sm:justify-start md:mt-10 md:w-full md:flex-col md:overflow-visible md:pb-0">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm transition md:w-full md:justify-start md:px-3 md:py-2 ${
                isActive
                  ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-200/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {cvUrl ? (
        <a
          href={cvUrl}
          className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 md:mt-auto"
          target="_blank"
          rel="noreferrer"
        >
          View CV
        </a>
      ) : null}
    </aside>
  );
}
