/**
 * Seed script - Downloads real product images and updates MongoDB
 * Run: node src/scripts/seedImages.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

const UPLOAD_DIR = path.join(__dirname, "../../assets/uploads");

// Real product images (free, no-auth URLs)
const PRODUCT_IMAGES = {
  iphone: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&q=80",
  iqoo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80",
  samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&q=80",
  oneplus: "https://images.unsplash.com/photo-1609692814857-5b11f4bb4178?w=400&h=400&fit=crop&q=80",
  pixel: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&q=80",
  macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
  dell: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop&q=80",
  hp: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop&q=80",
  airpods: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&q=80",
  "apple watch": "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop&q=80",
  ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80",
  "samsung tab": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80",
  headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&q=80",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&q=80",
  playstation: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&q=80",
  xbox: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop&q=80",
};

// Category fallbacks
const CATEGORY_IMAGES = {
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80",
  accessory: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
  gaming: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&q=80",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&q=80",
};

function findImageUrl(product) {
  const nameLower = product.name.toLowerCase();
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGES)) {
    if (nameLower.includes(keyword)) return url;
  }
  const catLower = (product.category || "").toLowerCase();
  if (CATEGORY_IMAGES[catLower]) return CATEGORY_IMAGES[catLower];
  return CATEGORY_IMAGES.electronics;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const handler = (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
      file.on("error", reject);
    };

    const client = url.startsWith("https") ? https : http;
    client.get(url, handler).on("error", reject);
  });
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected!\n");

  // Ensure uploads dir exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const products = await Product.find({});
  console.log(`Found ${products.length} products\n`);

  for (const product of products) {
    const imageUrl = findImageUrl(product);
    const filename = `product-${product._id}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    console.log(`[${product.name}]`);
    console.log(`  Downloading image...`);

    try {
      await downloadImage(imageUrl, filepath);
      await Product.findByIdAndUpdate(product._id, { image: filename });
      console.log(`  Saved: uploads/${filename}`);
      console.log(`  DB updated!\n`);
    } catch (err) {
      console.log(`  Error: ${err.message}\n`);
    }
  }

  console.log("Done! All products updated with images.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
