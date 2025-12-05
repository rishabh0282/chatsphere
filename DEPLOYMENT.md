## ChatSphere Deployment Guide (Wasabi + Railway + Vercel)

This setup avoids AWS billing by using Wasabi (S3-compatible), Railway for backend/DB/Redis, and Vercel for frontend.

### 1) Provision Services
- Wasabi: create a bucket (e.g., `chatsphere-uploads`), note access key/secret, region, and S3 endpoint (`https://s3.<region>.wasabisys.com`).
- Railway backend:
  - Create a project; add Postgres and Redis plugins.
  - Deploy the backend service from `chatsphere/server`.
- Vercel frontend: import `chatsphere/client` and set environment variables.

### 2) Backend Environment (Railway)
Set these on Railway (all required):
- `PORT=5000`
- `DATABASE_URL` (from Railway Postgres)
- `REDIS_URL` (from Railway Redis)
- `JWT_SECRET` (strong random)
- `JWT_REFRESH_SECRET` (strong random)
- `AWS_ACCESS_KEY_ID` (Wasabi)
- `AWS_SECRET_ACCESS_KEY` (Wasabi)
- `AWS_BUCKET_NAME` (your Wasabi bucket)
- `AWS_REGION=us-east-1` (or your region)
- `S3_ENDPOINT=https://s3.<region>.wasabisys.com`
- `S3_FORCE_PATH_STYLE=true`
- `NODE_ENV=production`

Commands (Railway build/run):
- Build: `npm install && npm run build`
- Start: `npm run start`
- Migrate: `npx prisma migrate deploy`

### 3) Frontend Environment (Vercel)
Set on Vercel:
- `VITE_API_URL=https://<your-railway-backend-url>`
- `VITE_SOCKET_URL=https://<your-railway-backend-url>`

Build command: `npm run build`  
Output directory: `dist`

### 4) Local-to-Prod Differences
- Local Docker uses MinIO; prod uses Wasabi. Keep `S3_FORCE_PATH_STYLE=true` in prod.
- For any other S3-compatible provider (e.g., Cloudflare R2), change `S3_ENDPOINT` and credentials; keep path style if the provider requires it.

### 5) CI/CD Hooks (optional)
- Add deploy steps to `.github/workflows/ci-cd.yml`:
  - Frontend: `amondnet/vercel-action` with Vercel token/org/project IDs.
  - Backend: Railway CLI (`railway up`) or Fly.io/Render equivalents.

### 6) Health Checks
- Backend: `/health` (HTTP)
- Socket: connect to `VITE_SOCKET_URL` with auth token.

