# ChatSphere Deployment Guide - Free Hosting Options

Complete guide to deploy ChatSphere for your portfolio using **100% free hosting services**.

## 📋 Overview

ChatSphere requires:
- **Backend Server** (Node.js + Express + Socket.io)
- **PostgreSQL Database**
- **Redis** (for pub/sub)
- **File Storage** (S3-compatible)
- **Frontend** (React + Vite)

## 🐳 Docker Deployment (Recommended)

**Why Docker?**
- ✅ Consistent environment across all platforms
- ✅ Faster deployments with layer caching
- ✅ Easier dependency management
- ✅ Works seamlessly with Railway, Render, Fly.io
- ✅ Better for production scaling

**Dockerfiles are included** in `server/Dockerfile` and `client/Dockerfile`. All deployment platforms below support Docker automatically!

---

## 🎯 Recommended Free Stack (Best Option)

### Option 1: Railway + Vercel + Cloudflare R2 (Recommended)
- **Backend + DB + Redis**: Railway (Free tier: $5 credit/month)
- **Frontend**: Vercel (Free forever)
- **File Storage**: Cloudflare R2 (Free tier: 10GB storage, 1M operations/month)

### Option 2: Render + Vercel + Cloudflare R2
- **Backend**: Render (Free tier: spins down after 15min inactivity)
- **PostgreSQL**: Render PostgreSQL (Free tier: 90 days)
- **Redis**: Upstash Redis (Free tier: 10K commands/day)
- **Frontend**: Vercel (Free forever)
- **File Storage**: Cloudflare R2 (Free tier)

### Option 3: Fly.io + Vercel + Cloudflare R2
- **Backend + DB**: Fly.io (Free tier: 3 shared VMs)
- **Redis**: Upstash Redis (Free tier)
- **Frontend**: Vercel (Free forever)
- **File Storage**: Cloudflare R2 (Free tier)

---

## 🚀 Step-by-Step Deployment: Render + Vercel + Cloudflare R2

### Step 1: Set Up Cloudflare R2 (File Storage)

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com) and sign up (free)

2. **Create R2 Bucket**
   - Navigate to **R2** in dashboard
   - Click **Create bucket**
   - Name: `chatsphere-uploads`
   - Choose a region (e.g., `us-east-1`)

3. **Create API Token**
   - Go to **Manage R2 API Tokens**
   - Click **Create API token**
   - Permissions: **Object Read & Write**
   - Save: `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`

4. **Get R2 Endpoint URL**
   - Format: `https://<account-id>.r2.cloudflarestorage.com`
   - Or use: `https://pub-<account-id>.r2.dev` (public endpoint)

---

### Step 2: Set Up Render (Backend + Database)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (free)

2. **Create PostgreSQL Database**
   - In Render dashboard, click **New +** → **PostgreSQL**
   - Name: `chatsphere-db`
   - Database: `chatsphere`
   - User: `chatsphere` (or auto-generated)
   - Region: Choose closest to you
   - Plan: **Free** (90 days free, then $7/month)
   - Click **Create Database**
   - Copy the **Internal Database URL** (you'll use this)

3. **Create Web Service (Backend)**
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select your repo
   - Configure:
     - **Name**: `chatsphere-backend`
     - **Root Directory**: `chatsphere/server`
     - **Region**: Same as PostgreSQL
     - **Branch**: `main` (or your default branch)
     - **Runtime**: **Docker** (Render will auto-detect Dockerfile)
     - **Plan**: **Free** (spins down after 15min inactivity)

4. **Set Up Upstash Redis**
   - Go to [upstash.com](https://upstash.com)
   - Sign up (free)
   - Create a new Redis database
   - Choose same region as Render
   - Copy the **REST URL** (format: `redis://default:<password>@<host>:<port>`)
   - Save this as `REDIS_URL`

5. **Configure Environment Variables**
   - In your Render Web Service, go to **Environment**
   - Add these variables:

```env
PORT=5000
DATABASE_URL=<from Render PostgreSQL - Internal Database URL>
REDIS_URL=<from Upstash>
JWT_SECRET=<generate-random-string>
JWT_REFRESH_SECRET=<generate-random-string>
FRONTEND_URL=https://<your-vercel-url>.vercel.app
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
AWS_BUCKET_NAME=chatsphere-uploads
AWS_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=false
NODE_ENV=production
```

   **Note**: 
   - Use the **Internal Database URL** from Render PostgreSQL (starts with `postgresql://`)
   - You'll add `FRONTEND_URL` after deploying to Vercel (Step 3)
   - Generate JWT secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

6. **Deploy**
   - Render will automatically detect your Dockerfile
   - Click **Create Web Service**
   - First deployment may take 5-10 minutes
   - Your app will be at: `https://<service-name>.onrender.com`

**Important Notes**:
- Render free tier spins down after 15min of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Dockerfile includes Prisma migrations, so they run automatically on startup
- For production, consider upgrading to paid plan ($7/month) for always-on service

---

### Step 3: Set Up Vercel (Frontend)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (free forever)

2. **Import Project**
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select **Root Directory**: `chatsphere/client`

3. **Configure Build Settings**
   - **Option A: Docker (Recommended)**
     - Vercel doesn't support Docker directly, but you can use traditional build
   - **Option B: Traditional Build**
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

**Note**: For Vercel, traditional build is recommended. Docker is better for backend deployments on Railway/Render.

4. **Set Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add:

```env
VITE_API_URL=https://<your-render-backend-url>.onrender.com
VITE_SOCKET_URL=https://<your-render-backend-url>.onrender.com
```

5. **Deploy**
   - Click **Deploy**
   - Wait for build to complete
   - Your app will be live at: `https://<project-name>.vercel.app`

---

### Step 4: Update CORS Configuration

1. **Add FRONTEND_URL to Render**
   - Go back to Render → Your Web Service → **Environment**
   - Add: `FRONTEND_URL=https://<your-vercel-url>.vercel.app`
   - Click **Save Changes**
   - Render will automatically redeploy

**Note**: The CORS configuration is now automatic! The code reads `FRONTEND_URL` from environment variables, so you don't need to edit any files. Just set the environment variable and Render will redeploy.

---

## 🔄 Alternative: Render Deployment (Option 2)

### Backend on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - **New** → **Web Service**
   - Connect GitHub repo
   - Root Directory: `chatsphere/server`
   - **Option A: Docker (Recommended)**
     - Render will auto-detect `Dockerfile` in server directory
     - No build/start commands needed
   - **Option B: Native Build**
     - Build Command: `npm install && npm run build && npx prisma generate`
     - Start Command: `npx prisma migrate deploy && npm run start`
     - Environment: **Node**

3. **Add PostgreSQL**
   - **New** → **PostgreSQL**
   - Name: `chatsphere-db`
   - Copy `DATABASE_URL`

4. **Add Redis (Upstash)**
   - Go to [upstash.com](https://upstash.com)
   - Create free Redis database
   - Copy `REDIS_URL`

5. **Set Environment Variables** (same as Railway)

**Note**: Render free tier spins down after 15min inactivity. First request may take 30-60s.

---

## 🚀 Step-by-Step Deployment: Fly.io + Vercel + Cloudflare R2

### Step 1: Set Up Cloudflare R2 (File Storage)

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com) and sign up (free)

2. **Create R2 Bucket**
   - Navigate to **R2** in dashboard
   - Click **Create bucket**
   - Name: `chatsphere-uploads`
   - Choose a region (e.g., `us-east-1`)

3. **Create API Token**
   - Go to **Manage R2 API Tokens**
   - Click **Create API token**
   - Permissions: **Object Read & Write**
   - Save: `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`

4. **Get R2 Endpoint URL**
   - Format: `https://<account-id>.r2.cloudflarestorage.com`
   - Or use: `https://pub-<account-id>.r2.dev` (public endpoint)

---

### Step 2: Set Up Fly.io (Backend + Database)

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```
   - This will open your browser to authenticate

3. **Navigate to Server Directory**
   ```bash
   cd chatsphere/server
   ```

4. **Create Fly App**
   ```bash
   fly launch
   ```
   - **App name**: Choose a unique name (e.g., `chatsphere-backend`)
   - **Region**: Choose closest region (e.g., `iad` for Washington DC)
   - **PostgreSQL**: Select **Yes** when asked (Fly.io will create it)
   - **Redis**: Select **No** (we'll use Upstash)
   - Fly.io will auto-detect your `Dockerfile` ✅
   - It will create `fly.toml` configuration file

5. **Attach PostgreSQL Database**
   ```bash
   # If you created PostgreSQL during fly launch, it's already attached
   # Otherwise, create and attach:
   fly postgres create --name chatsphere-db
   fly postgres attach chatsphere-db
   ```
   - This automatically sets `DATABASE_URL` as a secret

6. **Set Up Upstash Redis**
   - Go to [upstash.com](https://upstash.com)
   - Sign up (free)
   - Create a new Redis database
   - Choose same region as your Fly.io app
   - Copy the **REST URL** (format: `redis://default:<password>@<host>:<port>`)
   - Save this as `REDIS_URL`

7. **Set Environment Variables (Secrets)**
   ```bash
   # Generate JWT secrets first
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Set all secrets
   fly secrets set JWT_SECRET=<generated-secret>
   fly secrets set JWT_REFRESH_SECRET=<generated-refresh-secret>
   fly secrets set REDIS_URL=<from-upstash>
   fly secrets set AWS_ACCESS_KEY_ID=<r2-access-key>
   fly secrets set AWS_SECRET_ACCESS_KEY=<r2-secret-key>
   fly secrets set AWS_BUCKET_NAME=chatsphere-uploads
   fly secrets set AWS_REGION=auto
   fly secrets set S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   fly secrets set S3_FORCE_PATH_STYLE=false
   fly secrets set PORT=5000
   fly secrets set NODE_ENV=production
   ```

   **Note**: `DATABASE_URL` is automatically set when you attach PostgreSQL.

8. **Update fly.toml (Optional)**
   - The `fly.toml` file is already created
   - You can edit it to change region, app name, etc.
   - Health check is already configured

9. **Deploy Backend**
   ```bash
   fly deploy
   ```
   - This builds your Docker image and deploys it
   - First deployment may take 5-10 minutes
   - Your app will be at: `https://<app-name>.fly.dev`

10. **Test Backend**
    ```bash
    curl https://<app-name>.fly.dev/health
    # Should return: {"status":"ok"}
    ```

---

### Step 3: Set Up Vercel (Frontend)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (free forever)

2. **Import Project**
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select **Root Directory**: `chatsphere/client`

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Add:

```env
VITE_API_URL=https://<your-fly-app-name>.fly.dev
VITE_SOCKET_URL=https://<your-fly-app-name>.fly.dev
```

5. **Deploy**
   - Click **Deploy**
   - Wait for build to complete
   - Your app will be live at: `https://<project-name>.vercel.app`

---

### Step 4: Update CORS Configuration

1. **Add FRONTEND_URL to Fly.io**
   ```bash
   fly secrets set FRONTEND_URL=https://<your-vercel-url>.vercel.app
   ```

2. **Redeploy Backend**
   ```bash
   fly deploy
   ```

**Note**: The CORS configuration is automatic! The code reads `FRONTEND_URL` from environment variables, so you don't need to edit any files.

---

### Step 5: Verify Everything Works

1. **Test Backend Health**
   ```bash
   curl https://<app-name>.fly.dev/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Register a new user
   - Test real-time messaging

3. **Test File Upload**
   - Upload an image in chat
   - Verify it appears in Cloudflare R2 bucket

---

## 🔧 Fly.io Specific Commands

```bash
# View app status
fly status

# View logs
fly logs

# SSH into your app
fly ssh console

# Scale your app (if needed)
fly scale count 1

# View secrets
fly secrets list

# Update a secret
fly secrets set KEY=value

# Deploy
fly deploy

# Open app in browser
fly open
```

---

## 📝 Prisma Migration Setup

Before deploying, ensure migrations are set up:

1. **Generate Prisma Client**
   ```bash
   cd chatsphere/server
   npx prisma generate
   ```

2. **Create Migration** (if not exists)
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Migration runs automatically** on Railway/Render via:
   - **Docker**: Add to Dockerfile CMD or use platform hooks
   - **Railway**: `npx prisma migrate deploy` in start command (or use Railway's post-deploy hook)
   - **Render**: Add to start command or use Render's post-deploy script
   - **Fly.io**: Add to Dockerfile CMD or use fly.toml deploy hooks

**For Docker deployments**, you can update the Dockerfile CMD to:
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
```

Or use platform-specific deployment hooks (Railway/Render support these).

---

## 🧪 Testing Your Deployment

1. **Test Backend Health**
   ```bash
   curl https://<your-backend-url>/health
   # Should return: {"status":"ok"}
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Try registering a new user
   - Test real-time messaging

3. **Test File Upload**
   - Upload an image in chat
   - Verify it appears in Cloudflare R2 bucket

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Database connection fails
- **Solution**: Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Verify PostgreSQL service is running in Railway/Render

**Problem**: Redis connection fails
- **Solution**: Check `REDIS_URL` format: `redis://host:port` or `rediss://` for SSL
- For Upstash, use the **TCP endpoint** (NOT REST URL)
- Make sure you're using the TCP connection URL from Upstash dashboard

**Problem**: Prisma migration fails
- **Solution**: Ensure `prisma generate` runs before `prisma migrate deploy`
- Check database credentials are correct

### Frontend Issues

**Problem**: CORS errors
- **Solution**: Update CORS origin in backend to include your Vercel URL
- Check `VITE_API_URL` and `VITE_SOCKET_URL` are correct

**Problem**: Socket.io connection fails
- **Solution**: Verify `VITE_SOCKET_URL` matches backend URL
- Check Socket.io CORS settings in `server.ts`

**Problem**: File uploads fail
- **Solution**: Verify R2 credentials and bucket name
- Check `S3_ENDPOINT` format for Cloudflare R2
- Ensure bucket has public read access (if needed)

### Fly.io Specific

**Problem**: Build fails during `fly deploy`
- **Solution**: Check logs with `fly logs`
- Verify Dockerfile is in `server/` directory
- Ensure `fly.toml` exists and is configured correctly
- Try: `fly deploy --verbose` for detailed output

**Problem**: Database connection fails
- **Solution**: Verify PostgreSQL is attached: `fly postgres list`
- Check DATABASE_URL is set: `fly secrets list`
- Re-attach database: `fly postgres attach <db-name>`

**Problem**: App won't start
- **Solution**: Check logs: `fly logs`
- SSH into app: `fly ssh console`
- Verify all secrets are set: `fly secrets list`
- Check health endpoint: `curl https://<app-name>.fly.dev/health`

**Problem**: CORS errors from frontend
- **Solution**: Ensure `FRONTEND_URL` secret is set correctly
- Verify it matches your Vercel URL exactly
- Redeploy after setting: `fly deploy`

**Problem**: App sleeps after inactivity
- **Solution**: Fly.io free tier may sleep. Update `fly.toml`:
  ```toml
  [http_service]
    auto_stop_machines = false
    auto_start_machines = true
    min_machines_running = 1
  ```
  Note: This may use more resources on free tier.

### Railway Specific

**Problem**: Build fails
- **Solution**: Check build logs in Railway dashboard
- Ensure `package.json` has correct build scripts
- Verify Node.js version (Railway auto-detects)

**Problem**: Service goes to sleep
- **Solution**: Railway free tier doesn't sleep, but Render does
- Use Railway for better uptime

---

## 💰 Cost Breakdown (All Free)

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Render** | Free tier (spins down) | Backend hosting |
| **Render PostgreSQL** | 90 days free, then $7/month | Database |
| **Upstash Redis** | 10K commands/day | Redis (free tier) |
| **Vercel** | Free forever | Frontend hosting (unlimited) |
| **Cloudflare R2** | 10GB storage, 1M ops/month | File storage |

**Total Cost: $0/month** ✅

---

## 🚀 Quick Start Checklist (Render + Vercel + Cloudflare)

- [ ] Create Cloudflare R2 bucket and get credentials
- [ ] Set up Render account (GitHub login)
- [ ] Create PostgreSQL database on Render
- [ ] Set up Upstash Redis and get connection URL
- [ ] Create Web Service on Render (connects to GitHub)
- [ ] Set root directory: `chatsphere/server`
- [ ] Configure all environment variables in Render
- [ ] **Deploy backend to Render** (Docker auto-detected!)
- [ ] Set up Vercel account and import frontend
- [ ] Configure frontend environment variables (VITE_API_URL, VITE_SOCKET_URL)
- [ ] Deploy frontend to Vercel
- [ ] Add FRONTEND_URL to Render environment variables
- [ ] Test the application
- [ ] Update your portfolio with live demo link!

**Docker Note**: Render automatically detects and uses the Dockerfile. The Dockerfile includes Prisma migrations, so everything runs automatically on startup!

---

## 📚 Additional Resources

- [Fly.io Documentation](https://fly.io/docs)
- [Fly.io CLI Reference](https://fly.io/docs/flyctl/)
- [Vercel Documentation](https://vercel.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 You're Done!

Your ChatSphere app should now be live and ready for your portfolio! Share the Vercel URL with potential employers or clients.

**Need help?** Check the troubleshooting section or review the deployment logs in Railway/Vercel dashboards.
