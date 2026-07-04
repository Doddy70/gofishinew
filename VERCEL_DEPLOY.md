# Vercel Deployment README

## Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

### Required
- `DATABASE_URL` - Neon Postgres connection string (with `?sslmode=require`)
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Your Vercel domain (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_BASE_URL` - Same as BETTER_AUTH_URL

### Optional
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Health Check

Endpoint: `GET /api/health`
Returns status 200 when server is healthy.

## Build Command

```bash
npm run build
```

## Notes

- Uses Edge Runtime where possible for better performance
- Database connection via Neon Serverless (Postgres)
- Static assets served via Vercel CDN
