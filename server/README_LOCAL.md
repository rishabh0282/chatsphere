# Local Backend Development Setup

## Quick Start

1. **Create `.env.local` file:**
   ```bash
   cp env.example .env.local
   ```

2. **Update `.env.local` with your local settings:**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/chatsphere
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=dev_jwt_secret_change_me
   JWT_REFRESH_SECRET=dev_refresh_secret_change_me
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Set up local PostgreSQL:**
   - Install PostgreSQL locally
   - Create a database: `createdb chatsphere`
   - Update `DATABASE_URL` in `.env.local` with your credentials

4. **Set up local Redis (optional):**
   - Install Redis locally: `brew install redis` (Mac) or download for Windows
   - Start Redis: `redis-server`
   - Or use Docker: `docker run -p 6379:6379 redis`

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## Using Remote Services (Recommended for Quick Testing)

If you don't want to set up local PostgreSQL/Redis, you can use your remote services:

```env
# Use remote Render PostgreSQL
DATABASE_URL=<your-render-postgres-internal-url>

# Use remote Upstash Redis
REDIS_URL=<your-upstash-redis-tcp-url>

# Keep local frontend URL
FRONTEND_URL=http://localhost:3000
```

## Environment Variables

- **PORT**: Server port (default: 5000)
- **DATABASE_URL**: PostgreSQL connection string
- **REDIS_URL**: Redis connection string (TCP, not REST)
- **JWT_SECRET**: Secret for access tokens (generate secure value for production)
- **JWT_REFRESH_SECRET**: Secret for refresh tokens
- **FRONTEND_URL**: Frontend URL for CORS (use `http://localhost:3000` for local dev)
- **AWS_***: S3/Cloudflare R2 settings (optional for local dev)
- **NODE_ENV**: `development` for local, `production` for deployed

## Notes

- `.env.local` is gitignored and won't be committed
- `env.example` is committed as a template
- Changes to `.env.local` require restarting the dev server
- For production, set these in your hosting platform's environment variables

