import { NavLink } from 'react-router-dom';
import { categories } from '../data/projects';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M6.5 10.5V20h11V10.5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 1 1 0-4h2a4 4 0 1 0 0-8h-2z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="9.5" cy="7" r="1" />
      <circle cx="13" cy="7" r="1" />
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

function StackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M3 12l9 4.5 9-4.5" />
      <path d="M3 16.5L12 21l9-4.5" />
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

const iconByKey = {
  'ui-ux': <PaletteIcon />,
  'web-app': <CodeIcon />,
  'full-stack': <StackIcon />
};

export default function Sidebar() {
  const menuItems = [
    { label: 'Home', to: '/', icon: <HomeIcon /> },
    ...categories.map((category) => ({
      label: category.label,
      to: category.path,
      icon: iconByKey[category.key]
    })),
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

      <a
        href=""
        className="hidden rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-200 md:mt-auto md:inline-flex"
        target="_blank"
        rel="noreferrer"
      >
        View CV
      </a>
    </aside>
  );
}
