import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ADMIN_ROUTE_PATH } from './lib/routes';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function RouteFallback() {
  return <div className="px-6 pt-12 text-slate-300 md:px-10">Loading page...</div>;
}

function AdminShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="admin-grid pointer-events-none fixed inset-0 -z-10 opacity-70" />
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Private Area</p>
            <h1 className="font-display text-xl font-semibold text-white">Portfolio Admin</h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={ADMIN_ROUTE_PATH} element={<AdminPage />} />
            <Route path="*" element={<Navigate to={ADMIN_ROUTE_PATH} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function PublicShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(56,189,248,0.16),transparent_35%)]" />
      <div className="animated-orb orb-one" />
      <div className="animated-orb orb-two" />
      <div className="animated-orb orb-three" />

      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <main className="flex flex-1 flex-col">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/:categoryKey" element={<CategoryPage />} />
              <Route path="/:categoryKey/:projectSlug" element={<ProjectDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith(ADMIN_ROUTE_PATH);

  return isAdminRoute ? <AdminShell /> : <PublicShell />;
}
