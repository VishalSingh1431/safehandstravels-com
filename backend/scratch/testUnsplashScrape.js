import fetch from 'node-fetch';

async function scrapeUnsplash(query) {
  try {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    
    const html = await response.text();
    console.log('HTML Length:', html.length);
    console.log('HTML Preview:', html.substring(0, 1000));
    
    const regex = /https:\/\/images\.unsplash\.com\/photo-([^?"'\s>]+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      // Clean up the URL
      const cleanUrl = match[0].split('&')[0];
      matches.push(cleanUrl);
    }
    
    const uniqueMatches = [...new Set(matches)];
    console.log(`Found ${uniqueMatches.length} unique images for "${query}":`);
    console.log(uniqueMatches.slice(0, 5));
  } catch (error) {
    console.error('Scrape error:', error);
  }
}

scrapeUnsplash('jaipur');
