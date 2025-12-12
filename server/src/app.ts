import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();

// CORS configuration - allow frontend URL in production
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins: string[] = ['http://localhost:3000'];

if (frontendUrl) {
  // Add with and without trailing slash
  const urlWithoutSlash = frontendUrl.replace(/\/$/, '');
  const urlWithSlash = `${urlWithoutSlash}/`;
  allowedOrigins.push(urlWithoutSlash, urlWithSlash);
}

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure helmet to work with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(express.json());

// Rate limiting - but exclude health check
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.path === '/health'
  })
);

app.use(routes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;

