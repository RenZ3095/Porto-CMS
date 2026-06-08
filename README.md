# Portfolio Website

Modern React + Tailwind portfolio with:

- Public portfolio pages
- Secure Supabase-backed admin CRUD
- Email/password admin login
- Project image upload from your file manager
- Responsive layout for desktop, tablet, and mobile
- SEO metadata and route-based pages

## Run locally

```bash
npm install
npm run dev
```

## Environment setup

Create `.env` from `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PATH=/admin
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
VITE_CV_URL=https://example.com/your-cv.pdf
```

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL Editor and run [schema.sql](c:/Users/RENZ/Documents/Porto/supabase/schema.sql).
3. In Authentication, create your admin user.
4. Mark that user as admin by setting `app_metadata.is_admin = true`.
5. Copy your project URL and anon key into `.env`.

The app uses:

- `public.projects` for portfolio content
- `storage.project-images` for uploaded images
- Row Level Security so public users can only read, while admins can create/update/delete

## Admin usage

- Go to the value of `VITE_ADMIN_PATH`
- Sign in with your Supabase Auth account
- Create, edit, and delete projects
- Upload project images directly from your device

## Performance notes

- Project images are optimized in the browser before upload
- Public routes load only the data they need
- Route pages are lazy-loaded

## Deploy

### Vercel

1. Push to GitHub.
2. Import the repo into Vercel.
3. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, optional `VITE_FORMSPREE_ENDPOINT`, and `VITE_CV_URL`.
4. Deploy.
5. Attach your custom domain.

`VITE_CV_URL` can point to a public Google Drive, Supabase Storage, or other hosted PDF URL. This keeps the CV file out of GitHub while the deployed site can still open it.

### Netlify

1. Push to GitHub.
2. Import the repo into Netlify.
3. Add the same environment variables.
4. Deploy.
5. Attach your custom domain.

`vercel.json` and `netlify.toml` are already included for SPA rewrites.
