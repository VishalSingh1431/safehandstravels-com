import pool from '../config/database.js';

const instagramLinks = [
  "https://www.instagram.com/reel/DBbBoc2xj1d/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DBa_j7_RLtr/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DBa8tAKxiyV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DBa7Mp6Nv97/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DBbDXoVRcDv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/C-Xm_N9Rmvw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/C5sSJsDMHXW/?igsh=MXZlYW56bjZzZWJvcg==",
  "https://www.instagram.com/reel/C4n6OhFtu9G/?igsh=czJmdzZha3F2bHIz",
  "https://www.instagram.com/reel/C368phfroc0/?igsh=MWhpdnFqNHY5cHVkMQ==",
  "https://www.instagram.com/reel/C32KsCbRl8j/?igsh=MXN4OWUydTQ5czV2OQ==",
  "https://www.instagram.com/reel/C3IjC2dRyKu/?igsh=b3Y0c2hxZXlrNW9m"
];

async function addReviews() {
  try {
    for (const link of instagramLinks) {
      const insertQuery = `
        INSERT INTO reviews (name, rating, location, review, type, video_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(insertQuery, [
        "Happy Guest",
        5,
        "India",
        "See our happy guest's experience on Instagram!",
        "video",
        link,
        "active"
      ]);
      console.log(`Inserted review for link: ${link}`);
    }
    console.log("✅ All Instagram reviews inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting reviews:", error);
  } finally {
    process.exit(0);
  }
}

addReviews();
