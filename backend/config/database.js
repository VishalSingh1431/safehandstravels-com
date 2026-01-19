import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from backend directory (works even when run from different directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Parse MySQL connection string
let dbConfig = {};

console.log('🔍 Database Configuration Debug:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('   MYSQL_URL:', process.env.MYSQL_URL ? 'SET' : 'NOT SET');
console.log('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('   DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('   DB_NAME:', process.env.DB_NAME || 'NOT SET');

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  try {
    // MySQL URI format: mysql://user:password@host:port/database
    const uri = process.env.DATABASE_URL || process.env.MYSQL_URL;
    console.log('📝 Using DATABASE_URL format');
    console.log('   DATABASE_URL preview:', uri.substring(0, 30) + '...');
    
    // Validate URI format
    if (!uri.startsWith('mysql://') && !uri.startsWith('mysql2://')) {
      throw new Error('DATABASE_URL must start with mysql:// or mysql2://');
    }
    
    const url = new URL(uri);
    
    // Validate required components
    if (!url.hostname) {
      throw new Error('DATABASE_URL is missing hostname');
    }
    if (!url.username) {
      throw new Error('DATABASE_URL is missing username');
    }
    if (!url.password) {
      throw new Error('DATABASE_URL is missing password');
    }
    
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      database: url.pathname.replace(/^\//, '') || 'defaultdb',
      user: url.username,
      password: decodeURIComponent(url.password), // Decode URL-encoded password
    };
    
    console.log('✅ Database Config from DATABASE_URL:');
    console.log('   Host:', dbConfig.host);
    console.log('   Port:', dbConfig.port);
    console.log('   Database:', dbConfig.database);
    console.log('   User:', dbConfig.user);
    console.log('   Password:', dbConfig.password ? '*** (decoded)' : 'NOT SET');
  } catch (error) {
    console.error('❌ Invalid DATABASE_URL format:', error.message);
    console.error('📝 Expected format: mysql://username:password@host:port/database');
    console.error('   Full error:', error);
    throw error;
  }
} else {
  // Use individual environment variables
  console.log('📝 Using individual DB environment variables');
  dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'srv1672.hstgr.io',
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'),
    database: process.env.DB_NAME || process.env.MYSQL_DB || 'u427254332_SHT',
    user: process.env.DB_USER || process.env.MYSQL_USER || 'u427254332_SHT',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'Safe1431@@',
  };
  console.log('✅ Database Config from individual variables:');
  console.log('   Host:', dbConfig.host);
  console.log('   Port:', dbConfig.port);
  console.log('   Database:', dbConfig.database);
  console.log('   User:', dbConfig.user);
  console.log('   Password:', dbConfig.password ? '*** (set)' : 'NOT SET (using fallback)');
}

// MySQL connection pool (optimized for production)
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 30 : 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection
pool.on('connection', (connection) => {
  console.log('✅ Connected to MySQL');
});

// Helper function to retry queries on connection errors
export const queryWithRetry = async (queryFn, maxRetries = 3, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      // Check if it's a connection error that we should retry
      const isConnectionError = 
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.message?.includes('Connection lost') ||
        error.message?.includes('connection timeout');
      
      if (isConnectionError && attempt < maxRetries) {
        console.warn(`⚠️  Database connection error (attempt ${attempt}/${maxRetries}), retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

// Test database connection function
export const testConnection = async () => {
  console.log('🔄 Attempting database connection...');
  console.log('   Using config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password ? '***' : 'NOT SET',
  });
  
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection test successful');
    console.log('   Connection established to:', dbConfig.host);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error('   Error code:', error.code);
    console.error('   Error errno:', error.errno);
    console.error('   Error message:', error.message);
    console.error('   SQL State:', error.sqlState);
    
    if (error.code === 'ENOTFOUND') {
      console.error('   → DNS resolution failed. The hostname cannot be found.');
      console.error('   → FIX: Check your Hostinger MySQL settings');
      console.error('   → Try using "localhost" instead of the remote host');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   → Connection refused. The database server is not accepting connections.');
      console.error('   → FIX: Check if MySQL service is running');
      console.error('   → Verify the port number is correct (usually 3306)');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → Connection timeout. Network or firewall issue.');
      console.error('   → FIX: Check Remote MySQL access in Hostinger');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.errno === 1045) {
      console.error('   → Authentication failed. Wrong username or password.');
      console.error('   → FIX: Check your MySQL credentials in Hostinger');
      console.error('   → Username:', dbConfig.user);
      console.error('   → Host:', dbConfig.host);
      console.error('   → Database:', dbConfig.database);
      console.error('   → Check if user has permission to connect from this IP');
    } else if (error.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('   → Authentication method not supported.');
      console.error('   → FIX: MySQL server requires different authentication');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Database does not exist.');
      console.error('   → FIX: Check the database name in your DATABASE_URL');
      console.error('   → Attempted database:', dbConfig.database);
    } else {
      console.error('   → Unknown error. Full error object:', JSON.stringify(error, null, 2));
    }
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  console.log('🔄 Initializing database...');
  console.log('   Step 1: Testing database connection');
  
  // First test the connection
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Database initialization aborted - connection test failed');
    throw new Error('Database connection failed. Please check your database configuration.');
  }
  
  console.log('   Step 2: Connection test passed, proceeding with table initialization');

  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        phone VARCHAR(20),
        bio TEXT,
        picture TEXT,
        google_id VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_role CHECK (role IN ('main_admin', 'admin', 'user'))
      )
    `);

    // Add missing columns if they don't exist (for existing tables)
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN picture TEXT`);
      console.log('✅ Added missing "picture" column to users table');
    } catch (e) {
      // Column might already exist, ignore
    }

    try {
      await pool.query(`ALTER TABLE users ADD COLUMN google_id VARCHAR(255)`);
      console.log('✅ Added missing "google_id" column to users table');
    } catch (e) {
      // Column might already exist, ignore
    }

    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(50) DEFAULT 'user',
        ADD CONSTRAINT chk_role CHECK (role IN ('main_admin', 'admin', 'user'))
      `);
      console.log('✅ Added missing "role" column to users table');
    } catch (e) {
      // Column might already exist, ignore
    }

    // Create otps table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create businesses table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255),
        category VARCHAR(50) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        map_link TEXT,
        whatsapp VARCHAR(20),
        description TEXT NOT NULL,
        logo_url TEXT,
        images_url JSON DEFAULT ('[]'),
        youtube_video TEXT,
        social_links JSON DEFAULT ('{"instagram": "", "facebook": "", "website": ""}'),
        slug VARCHAR(255) NOT NULL UNIQUE,
        subdomain_url TEXT NOT NULL,
        subdirectory_url TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_category CHECK (category IN ('Shop', 'Restaurant', 'Hotel', 'Clinic', 'Library', 'Services', 'Temple', 'School', 'College', 'Gym', 'Salon', 'Spa', 'Pharmacy', 'Bank', 'Travel Agency', 'Real Estate', 'Law Firm', 'Accounting', 'IT Services', 'Photography', 'Event Management', 'Catering', 'Bakery', 'Jewelry', 'Fashion', 'Electronics', 'Furniture', 'Automobile', 'Repair Services', 'Education', 'Healthcare', 'Beauty', 'Fitness', 'Entertainment', 'Tourism', 'Food & Beverage', 'Retail', 'Wholesale', 'Manufacturing', 'Construction', 'Other')),
        CONSTRAINT chk_status CHECK (status IN ('pending', 'approved', 'rejected', 'active'))
      )
    `);

    // Create trips table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        price VARCHAR(50) NOT NULL,
        old_price VARCHAR(50),
        image_url TEXT,
        video_url TEXT,
        video_public_id TEXT,
        image_public_id TEXT,
        gallery JSON DEFAULT ('[]'),
        gallery_public_ids JSON DEFAULT ('[]'),
        subtitle TEXT,
        intro TEXT,
        why_visit JSON DEFAULT ('[]'),
        itinerary JSON DEFAULT ('[]'),
        included JSON DEFAULT ('[]'),
        not_included JSON DEFAULT ('[]'),
        notes JSON DEFAULT ('[]'),
        faq JSON DEFAULT ('[]'),
        reviews JSON DEFAULT ('[]'),
        category JSON DEFAULT ('[]'),
        recommended_trips JSON DEFAULT ('[]'),
        is_popular BOOLEAN DEFAULT FALSE,
        slug VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Add category column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE trips ADD COLUMN category JSON DEFAULT ('[]')`);
    } catch (e) {
      // Column might already exist, ignore
    }

    // Add is_popular column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE trips ADD COLUMN is_popular BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Column might already exist, ignore
    }

    // Add recommended_trips column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE trips ADD COLUMN recommended_trips JSON DEFAULT ('[]')`);
      console.log('✅ Added recommended_trips column to trips table');
    } catch (e) {
      // Column might already exist, ignore
    }

    // Add seats_left column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE trips ADD COLUMN seats_left INT DEFAULT NULL`);
      console.log('✅ Added seats_left column to trips table');
    } catch (e) {
      // Column might already exist, ignore
    }

    // Create certificates table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        images JSON DEFAULT ('[]'),
        images_public_ids JSON DEFAULT ('[]'),
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create destinations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        image_public_id TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create reviews table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        location VARCHAR(255),
        review TEXT NOT NULL,
        avatar TEXT,
        avatar_public_id TEXT,
        type VARCHAR(50) DEFAULT 'video',
        video_url TEXT,
        video_public_id TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
        CONSTRAINT chk_type CHECK (type IN ('text', 'video')),
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Add missing columns if they don't exist
    try {
      await pool.query(`ALTER TABLE reviews ADD COLUMN type VARCHAR(50) DEFAULT 'video'`);
    } catch (e) {
      // Column might already exist, ignore
    }

    try {
      await pool.query(`ALTER TABLE reviews ADD COLUMN video_url TEXT`);
    } catch (e) {
      // Column might already exist, ignore
    }

    try {
      await pool.query(`ALTER TABLE reviews ADD COLUMN video_public_id TEXT`);
    } catch (e) {
      // Column might already exist, ignore
    }

    // Create written_reviews table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS written_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        date VARCHAR(50),
        title VARCHAR(255),
        review TEXT NOT NULL,
        location VARCHAR(255),
        avatar TEXT,
        avatar_public_id TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create drivers table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        car VARCHAR(255) NOT NULL,
        experience VARCHAR(255),
        photo_url TEXT,
        photo_public_id TEXT,
        status VARCHAR(50) DEFAULT 'active',
        display_order INT DEFAULT 0,
        five_driver BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'inactive'))
      )
    `);

    // Add five_driver column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE drivers ADD COLUMN five_driver BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Column might already exist, ignore
    }

    // Create car_booking_settings table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS car_booking_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create product_page_settings table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_page_settings (
        id INT PRIMARY KEY DEFAULT 1,
        settings_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT single_row CHECK (id = 1)
      )
    `);

    // Create indexes for better query performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_slug ON trips(slug)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_location ON trips(location)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_written_reviews_status ON written_reviews(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_drivers_display_order ON drivers(display_order)`);

    // Create enquiries table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT,
        trip_title VARCHAR(255),
        trip_location VARCHAR(255),
        trip_price VARCHAR(50),
        selected_month VARCHAR(50),
        number_of_travelers INT DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('pending', 'contacted', 'booked', 'cancelled')),
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for enquiries
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_enquiries_trip_id ON enquiries(trip_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email)`);

    // Create app_settings table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create faqs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create banners table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT,
        image_public_id TEXT,
        title TEXT,
        subtitle TEXT,
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create branding_partners table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branding_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url TEXT,
        logo_public_id TEXT,
        link TEXT,
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create hotel_partners table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotel_partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url TEXT,
        logo_public_id TEXT,
        link TEXT,
        display_order INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('active', 'draft', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create location_filters table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS location_filters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filters JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create vibe_videos table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vibe_videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        videos JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create blogs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        content LONGTEXT NOT NULL,
        hero_image TEXT,
        hero_image_public_id TEXT,
        category VARCHAR(100),
        tags JSON DEFAULT ('[]'),
        author VARCHAR(255),
        author_id INT,
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'draft',
        display_order INT DEFAULT 0,
        views INT DEFAULT 0,
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords JSON DEFAULT ('[]'),
        published_at TIMESTAMP NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_status CHECK (status IN ('draft', 'published', 'archived')),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for blogs
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_blogs_display_order ON blogs(display_order)`);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default pool;
