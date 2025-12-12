# Local Development Setup

## Environment Variables

For local development, create a `.env.local` file in the `client` directory with the following:

```env
# Backend API URL (remote Render backend)
VITE_API_URL=https://chatsphere-backend-p045.onrender.com

# Socket.io URL (remote Render backend)
VITE_SOCKET_URL=https://chatsphere-backend-p045.onrender.com
```

**Note:** This setup uses the remote Render backend. If you want to use a local backend instead, change the URLs to `http://localhost:5000`.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values if needed:**
   - Default uses remote Render backend: `https://chatsphere-backend-p045.onrender.com`
   - To use local backend, change to: `http://localhost:5000`

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Notes

- `.env.local` is gitignored and won't be committed
- `.env.example` is committed as a template
- Environment variables must start with `VITE_` to be accessible in the frontend
- Changes to `.env.local` require restarting the dev server

