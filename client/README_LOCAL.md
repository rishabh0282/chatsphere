# Local Development Setup

## Environment Variables

For local development, create a `.env.local` file in the `client` directory with the following:

```env
# Backend API URL (local development)
VITE_API_URL=http://localhost:5000

# Socket.io URL (local development)
VITE_SOCKET_URL=http://localhost:5000
```

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values if needed:**
   - If your backend runs on a different port, update `VITE_API_URL`
   - If your socket server runs on a different port, update `VITE_SOCKET_URL`

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

