export const categories = [
  {
    key: 'ui-ux',
    label: 'UI/UX',
    title: 'UI/UX Projects',
    path: '/ui-ux',
    summary: 'User-centered design projects with research, wireframes, prototypes, and polished interfaces.'
  },
  {
    key: 'web-app',
    label: 'Web Apps',
    title: 'Web App Projects',
    path: '/web-app',
    summary: 'Responsive web applications focused on usability, clarity, and performance.'
  },
  {
    key: 'full-stack',
    label: 'Full Stack',
    title: 'Full Stack Projects',
    path: '/full-stack',
    summary: 'End-to-end products from frontend UX to backend APIs, auth, and databases.'
  }
];

export const seedProjects = [
  {
    slug: 'mobile-banking-redesign',
    category: 'ui-ux',
    title: 'Mobile Banking Redesign',
    shortDescription: 'A modern UX redesign to improve account visibility and transaction flow.',
    tech: ['Figma', 'Design System', 'User Testing'],
    image: '/images/uiux-banking.webp',
    github: 'https://github.com/your-username/mobile-banking-redesign',
    live: 'https://your-domain.com/mobile-banking-redesign',
    featured: true,
    problem: 'Users struggled to quickly find key account actions and balances.',
    process: 'I ran user journey mapping, built wireframes, and iterated high-fidelity prototypes.',
    results: 'Task completion time was reduced and user clarity improved across key screens.'
  },
  {
    slug: 'dashboard-wireframe-kit',
    category: 'ui-ux',
    title: 'Dashboard Wireframe Kit',
    shortDescription: 'Reusable wireframe system for analytics and management dashboards.',
    tech: ['Figma', 'UX Research', 'Prototyping'],
    image: '/images/uiux-dashboard.webp',
    github: 'https://github.com/your-username/dashboard-wireframe-kit',
    live: 'https://your-domain.com/dashboard-wireframe-kit',
    featured: false,
    problem: 'Teams were designing dashboard layouts from scratch repeatedly.',
    process: 'I built a reusable structure with standard cards, filters, and chart placements.',
    results: 'Design cycles became faster and layout consistency improved significantly.'
  },
  {
    slug: 'taskflow-app',
    category: 'web-app',
    title: 'TaskFlow Web App',
    shortDescription: 'A productivity app with task boards, filtering, and clean visual hierarchy.',
    tech: ['React', 'Tailwind', 'REST API'],
    image: '/images/webapp-taskflow.webp',
    github: 'https://github.com/your-username/taskflow-app',
    live: 'https://your-domain.com/taskflow-app',
    featured: true,
    problem: 'Project teams needed a lightweight planner with quick status tracking.',
    process: 'I designed reusable card components, route-based views, and keyboard-friendly UX.',
    results: 'Users could plan weekly tasks faster with fewer clicks and clearer status visibility.'
  },
  {
    slug: 'analytics-hub',
    category: 'web-app',
    title: 'Analytics Hub',
    shortDescription: 'Interactive KPI dashboard with widgets, charts, and responsive sections.',
    tech: ['React', 'Chart.js', 'Tailwind'],
    image: '/images/webapp-analytics.webp',
    github: 'https://github.com/your-username/analytics-hub',
    live: 'https://your-domain.com/analytics-hub',
    featured: false,
    problem: 'Stakeholders lacked a unified and accessible view of key business metrics.',
    process: 'Built modular chart cards and clean filtering controls for various screen sizes.',
    results: 'Decision-making improved through at-a-glance dashboards and better data readability.'
  },
  {
    slug: 'portfolio-cms',
    category: 'full-stack',
    title: 'Portfolio CMS',
    shortDescription: 'Full-stack portfolio platform with admin panel and content publishing.',
    tech: ['React', 'Node.js', 'MongoDB'],
    image: '/images/fullstack-cms.webp',
    github: 'https://github.com/your-username/portfolio-cms',
    live: 'https://your-domain.com/portfolio-cms',
    featured: true,
    problem: 'Portfolio updates took too long due to manual code changes.',
    process: 'I structured the portfolio around a Supabase projects table, connected public pages to published data, then built an admin dashboard for creating, editing, featuring, and uploading project images without touching the codebase.',
    results: 'New projects can now be published in minutes instead of hours.'
  },
  {
    slug: 'inventory-manager',
    category: 'full-stack',
    title: 'Inventory Manager',
    shortDescription: 'Inventory and supplier tracking system with audit logs and role access.',
    tech: ['React', 'Express', 'PostgreSQL'],
    image: '/images/fullstack-inventory.webp',
    github: 'https://github.com/your-username/inventory-manager',
    live: 'https://your-domain.com/inventory-manager',
    featured: false,
    problem: 'Manual stock tracking caused delayed updates and inaccurate item counts.',
    process: 'Created secure APIs, transactional updates, and role-based dashboard pages.',
    results: 'Stock accuracy improved and teams gained reliable real-time inventory visibility.'
  }
];

export const testimonials = [
  {
    name: 'Ariana S.',
    role: 'Product Manager',
    quote: 'Renz translated rough ideas into a clean product experience our team can ship confidently.'
  },
  {
    name: 'Michael T.',
    role: 'Startup Founder',
    quote: 'Strong design sense and reliable implementation. The final product looked premium and fast.'
  },
  {
    name: 'Lina C.',
    role: 'Operations Lead',
    quote: 'The workflow redesign reduced confusion and made daily operations easier for everyone.'
  }
];

export const localProjects = seedProjects.filter((project) => project.localOnly);

export function getCategoryByKey(categoryKey) {
  return categories.find((category) => category.key === categoryKey);
}

export function getCategoryLabel(categoryKey) {
  return getCategoryByKey(categoryKey)?.label ?? categoryKey;
}

export function getProjectsByCategory(categoryKey, projects) {
  return projects.filter((project) => project.category === categoryKey);
}

export function getProjectBySlug(categoryKey, slug, projects) {
  return projects.find((project) => project.category === categoryKey && project.slug === slug);
}
