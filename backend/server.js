import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import compression from 'compression';
import morgan from 'morgan';
import { initializeDatabase } from './config/database.js';
import { validateEnv } from './middleware/validateEnv.js';
import { securityMiddleware } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import tripsRoutes from './routes/trips.js';
import enquiriesRoutes from './routes/enquiries.js';
import certificatesRoutes from './routes/certificates.js';
import destinationsRoutes from './routes/destinations.js';
import reviewsRoutes from './routes/reviews.js';
import writtenReviewsRoutes from './routes/writtenReviews.js';
import driversRoutes from './routes/drivers.js';
import carBookingSettingsRoutes from './routes/carBookingSettings.js';
import productPageSettingsRoutes from './routes/productPageSettings.js';
import locationFiltersRoutes from './routes/locationFilters.js';
import vibeVideosRoutes from './routes/vibeVideos.js';
import faqsRoutes from './routes/faqs.js';
import bannersRoutes from './routes/banners.js';
import brandingPartnersRoutes from './routes/brandingPartners.js';
import hotelPartnersRoutes from './routes/hotelPartners.js';

// Load .env from backend directory (works even when run from different directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//dotenv.config({ path: join(__dirname, '.env') });
dotenv.config();

// Validate environment variables (non-blocking in production)
if (process.env.NODE_ENV !== 'production') {
  validateEnv();
} else {
  // In production, just warn but don't crash
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
    console.warn('⚠️  Server will continue, but some features may not work');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy - Required when behind Nginx reverse proxy
app.set('trust proxy', 1);

// Initialize PostgreSQL database (non-blocking)
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialized successfully');
  })
  .catch((error) => {
    console.error('❌ Database initialization error:', error.message);
    console.warn('⚠️  Server will continue running, but database features may not work');
    console.warn('⚠️  Please check your DATABASE_URL in .env file');
  });

// Security middleware
app.use(securityMiddleware);

// Compression middleware (gzip)
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL 
        ? [process.env.FRONTEND_URL] 
        : ['https://varanasihub.com', 'https://www.varanasihub.com'])
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Request logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined')); // Apache combined log format
} else {
  app.use(morgan('dev')); // Colored output for development
}

// Body parsing middleware - increased limits for large file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const pool = (await import('./config/database.js')).default;
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'VaranasiHub API is running',
      database: 'connected',
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'VaranasiHub API is running',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        message: error.message,
      } : undefined,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/written-reviews', writtenReviewsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/car-booking-settings', carBookingSettingsRoutes);
app.use('/api/product-page-settings', productPageSettingsRoutes);
app.use('/api/location-filters', locationFiltersRoutes);
app.use('/api/vibe-videos', vibeVideosRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/branding-partners', brandingPartnersRoutes);
app.use('/api/hotel-partners', hotelPartnersRoutes);

// Serve React Frontend (Vite build is in frontend/dist)
// Recursive function to find dist folder with index.html
function findDistFolder(startPath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return null;
  
  try {
    const items = fs.readdirSync(startPath);
    for (const item of items) {
      const fullPath = join(startPath, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          // Check if this is the dist folder with index.html
          const indexPath = join(fullPath, 'index.html');
          if (item === 'dist' && fs.existsSync(indexPath)) {
            return fullPath;
          }
          // Recursively search subdirectories
          const found = findDistFolder(fullPath, maxDepth, currentDepth + 1);
          if (found) return found;
        }
      } catch (e) {
        // Skip if can't read
        continue;
      }
    }
  } catch (e) {
    // Skip if can't read directory
  }
  return null;
}

// Try multiple possible paths for Hostinger deployment
// Based on actual location: /public_html/.builds/source/repository/frontend/dist/
const possibleBuildPaths = [
  // Hostinger GitHub deployment paths (try these first)
  join(__dirname, '..', 'frontend', 'dist'),      // From backend/ to frontend/dist (most likely)
  join(process.cwd(), '.builds', 'source', 'repository', 'frontend', 'dist'), // From cwd
  join(process.cwd(), 'frontend', 'dist'),        // From cwd/frontend/dist
  join(__dirname, '..', '..', 'frontend', 'dist'), // From backend/../frontend/dist
  join(__dirname, '..', '..', '..', 'frontend', 'dist'), // From backend/../../frontend/dist
  
  // Absolute paths for Hostinger
  '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html/.builds/source/repository/frontend/dist',
  '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html/frontend/dist',
  '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html/dist',
  
  // Other common paths
  join(__dirname, 'dist'),                         // dist in same folder as server.js
  join(__dirname, '..', 'dist'),                   // dist one level up from server.js
  join(__dirname, 'frontend', 'dist'),            // frontend/ is inside backend/
  join(process.cwd(), 'dist'),                     // dist is in root
  join(process.cwd(), 'public_html', 'dist'),     // Hostinger dist in public_html
  join(process.cwd(), 'public_html', 'frontend', 'dist'), // Hostinger public_html structure
  join(process.cwd(), 'public_html', '.builds', 'source', 'repository', 'frontend', 'dist'), // Full Hostinger path
];

console.log('🔍 Checking for React build folder...');
console.log('📁 Current working directory:', process.cwd());
console.log('📁 __dirname:', __dirname);

let buildPath = possibleBuildPaths.find(p => {
  const indexPath = join(p, 'index.html');
  const exists = fs.existsSync(p) && fs.existsSync(indexPath);
  if (exists) {
    console.log(`✅ Found build at: ${p}`);
  }
  return exists;
});

// If not found in common paths, try recursive search (with increased depth for Hostinger)
if (!buildPath) {
  console.log('🔍 Searching recursively for dist folder (increased depth for Hostinger)...');
  const searchPaths = [
    __dirname,
    join(__dirname, '..'),
    join(__dirname, '..', '..'),
    join(__dirname, '..', '..', '..'),
    process.cwd(),
    join(process.cwd(), '..'),
    join(process.cwd(), '.builds'),
    join(process.cwd(), 'public_html'),
    // Try to find .builds directory from various starting points
    '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html',
    '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html/.builds',
  ];
  
  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      console.log(`🔍 Searching in: ${searchPath}`);
      const found = findDistFolder(searchPath, 6); // Increased depth to 6 for Hostinger structure
      if (found) {
        console.log(`✅ Found build recursively at: ${found}`);
        buildPath = found;
        break;
      }
    } else {
      console.log(`❌ Path does not exist: ${searchPath}`);
    }
  }
  
  // Last resort: Try to directly access the known path
  if (!buildPath) {
    const knownPaths = [
      '/home/u427254332/domains/chocolate-nightingale-338585.hostingersite.com/public_html/.builds/source/repository/frontend/dist',
      join(process.cwd(), '.builds', 'source', 'repository', 'frontend', 'dist'),
      join(__dirname, '..', '..', '..', 'source', 'repository', 'frontend', 'dist'),
    ];
    
    for (const knownPath of knownPaths) {
      const indexPath = join(knownPath, 'index.html');
      if (fs.existsSync(knownPath) && fs.existsSync(indexPath)) {
        console.log(`✅ Found build at known path: ${knownPath}`);
        buildPath = knownPath;
        break;
      } else {
        console.log(`❌ Known path check failed: ${knownPath} (exists: ${fs.existsSync(knownPath)}, has index: ${fs.existsSync(indexPath)})`);
      }
    }
  }
}

if (buildPath) {
  console.log('✅ Serving React frontend from:', buildPath);
  
  // Serve static files (CSS, JS, images, etc.) with proper MIME types
  app.use(express.static(buildPath, {
    maxAge: '1d', // Cache static assets for 1 day
    etag: true,
  }));
  
  // Serve index.html for all non-API routes (React Router)
  app.get('*', (req, res, next) => {
    // Skip API routes - let them fall through to 404 handler
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Serve React app for all other routes
    const indexPath = join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('❌ index.html not found at:', indexPath);
      next();
    }
  });
} else {
  console.error('❌ React build folder not found!');
  console.error('📋 Checked paths:');
  possibleBuildPaths.forEach(p => {
    const exists = fs.existsSync(p);
    console.error(`   ${exists ? '✅' : '❌'} ${p}`);
    if (exists) {
      try {
        const files = fs.readdirSync(p);
        console.error(`      Contents: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
      } catch (e) {
        console.error(`      (Cannot read directory)`);
      }
    }
  });
  console.error('⚠️  Make sure to:');
  console.error('   1. Run: cd frontend && npm run build');
  console.error('   2. Upload the frontend/dist folder to your server');
  console.error('   3. Ensure it\'s in the correct location relative to server.js');
  console.error('');
  console.error('💡 QUICK FIX: Upload frontend/dist folder to the same directory as server.js');
  console.error('   Then the path will be: ' + join(__dirname, 'dist'));
  
  // Fallback: Show helpful message on root route with upload instructions
  app.get('/', (req, res) => {
    const uploadInstructions = `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2>📦 Manual Upload Instructions:</h2>
        <ol>
          <li>On your local machine, go to: <code>frontend/dist</code></li>
          <li>Zip the entire <code>dist</code> folder</li>
          <li>Go to Hostinger → File Manager</li>
          <li>Navigate to where <code>server.js</code> is located</li>
          <li>Upload and extract the <code>dist</code> folder there</li>
          <li>Restart Node.js app in Hostinger panel</li>
        </ol>
        <p><strong>Expected structure after upload:</strong></p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
${join(__dirname, 'server.js')}
${join(__dirname, 'dist')}
${join(__dirname, 'dist', 'index.html')}
        </pre>
      </div>
    `;
    
    res.status(503).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Frontend Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f9f9f9; }
            .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #d32f2f; }
            code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
            a { color: #1976d2; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ React Frontend Not Found</h1>
            <p>The frontend build folder (<code>frontend/dist</code>) was not found on the server.</p>
            
            <h3>🔍 Debug Information:</h3>
            <ul>
              <li><strong>Server location:</strong> <code>${__dirname}</code></li>
              <li><strong>Working directory:</strong> <code>${process.cwd()}</code></li>
              <li><strong>Check debug endpoint:</strong> <a href="/api/debug/paths" target="_blank">/api/debug/paths</a></li>
              <li><strong>API health:</strong> <a href="/api/health" target="_blank">/api/health</a></li>
            </ul>
            
            ${uploadInstructions}
            
            <h3>📝 Alternative: Build on Server</h3>
            <p>If you have terminal access on Hostinger, you can build directly on the server:</p>
            <pre>cd frontend
npm install
npm run build</pre>
          </div>
        </body>
      </html>
    `);
  });
}

// Debug route to check paths (remove in production)
app.get('/api/debug/paths', (req, res) => {
  // List what's actually in common directories
  function listDir(dirPath) {
    try {
      if (fs.existsSync(dirPath)) {
        return fs.readdirSync(dirPath).map(item => {
          const fullPath = join(dirPath, item);
          try {
            const stat = fs.statSync(fullPath);
            return {
              name: item,
              type: stat.isDirectory() ? 'directory' : 'file',
              path: fullPath,
            };
          } catch {
            return { name: item, type: 'unknown' };
          }
        });
      }
    } catch (e) {
      return [];
    }
    return [];
  }

  const debugInfo = {
    __dirname,
    cwd: process.cwd(),
    buildPaths: possibleBuildPaths.map(p => ({
      path: p,
      exists: fs.existsSync(p),
      hasIndex: fs.existsSync(join(p, 'index.html')),
    })),
    foundBuildPath: buildPath || null,
    directories: {
      __dirname: listDir(__dirname),
      parent: listDir(join(__dirname, '..')),
      cwd: listDir(process.cwd()),
      cwdParent: listDir(join(process.cwd(), '..')),
    },
  };
  res.json(debugInfo);
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });
  
  const statusCode = err.statusCode || err.status || 500;
  const isDevelopment = NODE_ENV === 'development';
  
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(isDevelopment && { 
      stack: err.stack,
      path: req.path,
    }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`📝 Database: PostgreSQL (Aiven)`);
  const apiUrl = NODE_ENV === 'production' 
    ? `https://${process.env.BASE_DOMAIN || 'varanasihub.com'}/api`
    : `http://localhost:${PORT}/api`;
  console.log(`🌐 API Base URL: ${apiUrl}`);
  if (NODE_ENV === 'production') {
    console.log(`🔒 Security: Enabled (Helmet)`);
    console.log(`📊 Logging: Enabled (Morgan)`);
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   Please stop the process using port ${PORT} or change the PORT in .env`);
    console.error(`   To find and kill the process: Get-NetTCPConnection -LocalPort ${PORT} | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});
