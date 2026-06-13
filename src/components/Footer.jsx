const footerLinks = [
  { label: 'GitHub', href: import.meta.env.VITE_GITHUB_URL },
  { label: 'LinkedIn', href: import.meta.env.VITE_LINKEDIN_URL },
  {
    label: 'Email',
    href: import.meta.env.VITE_CONTACT_EMAIL ? `mailto:${import.meta.env.VITE_CONTACT_EMAIL}` : ''
  }
].filter((link) => link.href);

export default function Footer() {
  return (
    <footer className="mx-6 mb-6 mt-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md md:mx-10">
      <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>Copyright {new Date().getFullYear()} Renz. Building thoughtful web experiences and digital products.</p>
        {footerLinks.length ? (
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <a key={link.label} className="text-cyan-200 transition hover:text-cyan-100" href={link.href} target={link.label === 'Email' ? undefined : '_blank'} rel={link.label === 'Email' ? undefined : 'noreferrer'}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
