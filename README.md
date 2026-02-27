# UX Support Group Web site

Website for UX Support Group Community.

## Current Stack

- **Frontend**: Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- **Backend**: Self-hosted Supabase (not Lovable)
- **Hosting**: Netlify
- **Source of Truth**: GitHub

## How to Edit

**Option 1: Local Development**
```sh
# Clone the repo
git clone https://github.com/danny-cocreate/uxsupportgroup.git

# Navigate to project
cd uxsupportgroup

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Option 2: GitHub**
- Edit files directly in GitHub and commit changes
- Pushes trigger automatic Netlify deploys

**Option 3: Cursor**
- Open the cloned repo in Cursor
- Make changes locally and push to GitHub

## Deployment

The site auto-deploys to Netlify on every push to `main`.

**Live URL**: https://uxsupportgroup.netlify.app

## Supabase

Data is managed via a self-hosted Supabase instance. Configure credentials in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
