import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Define your base URL (Change this to your actual domain)
const BASE_URL = 'https://safehandstravels.com';

// 2. Define your static routes here
const routes = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/gallery', // Add any other public routes you have
  // '/packages',
];

// Helper to get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  try {
    // 3. (Optional) Fetch dynamic routes here
    // Example: const products = await fetch('https://api.example.com/products').then(res => res.json());
    // products.forEach(p => routes.push(`/product/${p.id}`));

    // 4. Build the XML content
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

    // 5. Write to the public directory
    // Taking step back from 'scripts' folder -> 'frontend' -> 'public'
    const publicDir = path.resolve(__dirname, '../public');
    
    // Ensure public dir exists (it should in a standard Vite app)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);

    console.log(`✅ Sitemap generated at: ${sitemapPath}`);
    console.log(`Don't forget to submit this URL to Google Search Console: ${BASE_URL}/sitemap.xml`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

generateSitemap();
