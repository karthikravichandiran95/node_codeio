const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

// Category wise colors for placeholder images
const categoryColors = {
  mobile: "1a73e8/ffffff",     // blue
  laptop: "e91e63/ffffff",     // pink
  audio: "ff9800/ffffff",      // orange
  tablet: "9c27b0/ffffff",     // purple
  watch: "4caf50/ffffff",      // green
  accessory: "607d8b/ffffff",  // grey
};

const makeImage = (name, category) => {
  const color = categoryColors[category];
  return `https://placehold.co/400x400/${color}/png?text=${encodeURIComponent(name)}`;
};

const products = [
  // ========== MOBILE (20) ==========
  { name: "iPhone 16", price: 79999, category: "mobile", stock: 50 },
  { name: "iPhone 16 Pro Max", price: 144900, category: "mobile", stock: 30 },
  { name: "iPhone 15", price: 69999, category: "mobile", stock: 40 },
  { name: "Samsung Galaxy S24 Ultra", price: 129999, category: "mobile", stock: 35 },
  { name: "Samsung Galaxy S24", price: 74999, category: "mobile", stock: 45 },
  { name: "Samsung Galaxy A55", price: 29999, category: "mobile", stock: 60 },
  { name: "OnePlus 12", price: 64999, category: "mobile", stock: 40 },
  { name: "OnePlus 12R", price: 39999, category: "mobile", stock: 55 },
  { name: "OnePlus Nord 4", price: 27999, category: "mobile", stock: 70 },
  { name: "Google Pixel 9 Pro", price: 109999, category: "mobile", stock: 25 },
  { name: "Google Pixel 9", price: 79999, category: "mobile", stock: 35 },
  { name: "Nothing Phone 2", price: 44999, category: "mobile", stock: 45 },
  { name: "Xiaomi 14 Ultra", price: 99999, category: "mobile", stock: 20 },
  { name: "Xiaomi Redmi Note 13 Pro", price: 24999, category: "mobile", stock: 80 },
  { name: "Realme GT 6", price: 34999, category: "mobile", stock: 50 },
  { name: "Vivo X100 Pro", price: 89999, category: "mobile", stock: 30 },
  { name: "Oppo Find X7 Ultra", price: 99999, category: "mobile", stock: 20 },
  { name: "Motorola Edge 50 Pro", price: 31999, category: "mobile", stock: 45 },
  { name: "iQOO 12", price: 52999, category: "mobile", stock: 35 },
  { name: "Poco F6 Pro", price: 29999, category: "mobile", stock: 60 },

  // ========== LAPTOP (20) ==========
  { name: "MacBook Air M3", price: 114900, category: "laptop", stock: 25 },
  { name: "MacBook Pro M3 Pro", price: 199900, category: "laptop", stock: 15 },
  { name: "MacBook Pro M3 Max", price: 349900, category: "laptop", stock: 10 },
  { name: "Dell XPS 15", price: 149999, category: "laptop", stock: 20 },
  { name: "Dell Inspiron 15", price: 54999, category: "laptop", stock: 40 },
  { name: "HP Pavilion 15", price: 64999, category: "laptop", stock: 35 },
  { name: "HP Spectre x360", price: 139999, category: "laptop", stock: 15 },
  { name: "Lenovo ThinkPad X1 Carbon", price: 164999, category: "laptop", stock: 20 },
  { name: "Lenovo IdeaPad Slim 5", price: 59999, category: "laptop", stock: 45 },
  { name: "Asus ZenBook 14", price: 79999, category: "laptop", stock: 30 },
  { name: "Asus ROG Strix G16", price: 129999, category: "laptop", stock: 20 },
  { name: "Asus TUF Gaming F15", price: 74999, category: "laptop", stock: 35 },
  { name: "Acer Nitro V 15", price: 69999, category: "laptop", stock: 30 },
  { name: "Acer Swift Go 14", price: 84999, category: "laptop", stock: 25 },
  { name: "MSI Katana 15", price: 89999, category: "laptop", stock: 20 },
  { name: "Samsung Galaxy Book 4 Pro", price: 134999, category: "laptop", stock: 15 },
  { name: "Microsoft Surface Laptop 6", price: 119999, category: "laptop", stock: 20 },
  { name: "Lenovo Legion 5 Pro", price: 144999, category: "laptop", stock: 15 },
  { name: "HP Victus 16", price: 69999, category: "laptop", stock: 40 },
  { name: "Dell G15 Gaming", price: 79999, category: "laptop", stock: 30 },

  // ========== AUDIO (20) ==========
  { name: "AirPods Pro 2", price: 24999, category: "audio", stock: 60 },
  { name: "AirPods Max", price: 59999, category: "audio", stock: 25 },
  { name: "Sony WH-1000XM5", price: 29999, category: "audio", stock: 40 },
  { name: "Sony WF-1000XM5", price: 24999, category: "audio", stock: 45 },
  { name: "Samsung Galaxy Buds 3 Pro", price: 17999, category: "audio", stock: 50 },
  { name: "JBL Tune 770NC", price: 4999, category: "audio", stock: 80 },
  { name: "JBL Flip 6", price: 11999, category: "audio", stock: 60 },
  { name: "JBL Charge 5", price: 17999, category: "audio", stock: 45 },
  { name: "Bose QuietComfort Ultra", price: 34999, category: "audio", stock: 30 },
  { name: "Bose SoundLink Max", price: 29999, category: "audio", stock: 25 },
  { name: "Nothing Ear 2", price: 9999, category: "audio", stock: 55 },
  { name: "OnePlus Buds 3", price: 5499, category: "audio", stock: 70 },
  { name: "Boat Airdopes 441", price: 1499, category: "audio", stock: 100 },
  { name: "Boat Rockerz 550", price: 1999, category: "audio", stock: 90 },
  { name: "Marshall Major IV", price: 12999, category: "audio", stock: 35 },
  { name: "Sennheiser Momentum 4", price: 27999, category: "audio", stock: 20 },
  { name: "Jabra Elite 85t", price: 15999, category: "audio", stock: 30 },
  { name: "Google Pixel Buds Pro 2", price: 22999, category: "audio", stock: 35 },
  { name: "Skullcandy Crusher Evo", price: 9999, category: "audio", stock: 40 },
  { name: "Audio-Technica ATH-M50x", price: 14999, category: "audio", stock: 25 },

  // ========== TABLET (15) ==========
  { name: "iPad Pro M4 11-inch", price: 99999, category: "tablet", stock: 25 },
  { name: "iPad Pro M4 13-inch", price: 134900, category: "tablet", stock: 15 },
  { name: "iPad Air M2", price: 74999, category: "tablet", stock: 30 },
  { name: "iPad 10th Gen", price: 44999, category: "tablet", stock: 50 },
  { name: "iPad Mini 7", price: 49999, category: "tablet", stock: 35 },
  { name: "Samsung Galaxy Tab S9 Ultra", price: 108999, category: "tablet", stock: 15 },
  { name: "Samsung Galaxy Tab S9", price: 74999, category: "tablet", stock: 25 },
  { name: "Samsung Galaxy Tab A9", price: 16999, category: "tablet", stock: 60 },
  { name: "OnePlus Pad 2", price: 39999, category: "tablet", stock: 30 },
  { name: "Xiaomi Pad 6", price: 26999, category: "tablet", stock: 40 },
  { name: "Lenovo Tab P12", price: 29999, category: "tablet", stock: 35 },
  { name: "Realme Pad 2", price: 17999, category: "tablet", stock: 45 },
  { name: "Microsoft Surface Pro 10", price: 159999, category: "tablet", stock: 10 },
  { name: "Google Pixel Tablet", price: 44999, category: "tablet", stock: 20 },
  { name: "Huawei MatePad Pro", price: 54999, category: "tablet", stock: 15 },

  // ========== WATCH (15) ==========
  { name: "Apple Watch Ultra 2", price: 89999, category: "watch", stock: 20 },
  { name: "Apple Watch Series 9", price: 44999, category: "watch", stock: 40 },
  { name: "Apple Watch SE 2", price: 29999, category: "watch", stock: 50 },
  { name: "Samsung Galaxy Watch 6 Classic", price: 34999, category: "watch", stock: 30 },
  { name: "Samsung Galaxy Watch 6", price: 24999, category: "watch", stock: 45 },
  { name: "Google Pixel Watch 2", price: 34999, category: "watch", stock: 25 },
  { name: "OnePlus Watch 2", price: 24999, category: "watch", stock: 35 },
  { name: "Noise ColorFit Pro 5", price: 3999, category: "watch", stock: 80 },
  { name: "Boat Wave Sigma", price: 1999, category: "watch", stock: 100 },
  { name: "Amazfit GTR 4", price: 14999, category: "watch", stock: 40 },
  { name: "Garmin Venu 3", price: 49999, category: "watch", stock: 15 },
  { name: "Fitbit Sense 2", price: 22999, category: "watch", stock: 25 },
  { name: "Xiaomi Watch 2 Pro", price: 17999, category: "watch", stock: 35 },
  { name: "Titan Smart Pro", price: 9999, category: "watch", stock: 50 },
  { name: "Fire-Boltt Phoenix Pro", price: 2999, category: "watch", stock: 70 },

  // ========== ACCESSORY (10) ==========
  { name: "Apple MagSafe Charger", price: 4999, category: "accessory", stock: 60 },
  { name: "Samsung 45W Fast Charger", price: 2999, category: "accessory", stock: 70 },
  { name: "Anker 65W GaN Charger", price: 3499, category: "accessory", stock: 55 },
  { name: "Apple Pencil 2nd Gen", price: 11999, category: "accessory", stock: 40 },
  { name: "Logitech MX Master 3S", price: 9999, category: "accessory", stock: 35 },
  { name: "Logitech MX Keys S", price: 12999, category: "accessory", stock: 30 },
  { name: "Samsung T7 SSD 1TB", price: 8999, category: "accessory", stock: 45 },
  { name: "SanDisk 256GB USB Drive", price: 1999, category: "accessory", stock: 80 },
  { name: "Spigen iPhone 16 Case", price: 1499, category: "accessory", stock: 90 },
  { name: "Belkin 3-in-1 Wireless Charger", price: 12999, category: "accessory", stock: 25 },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");

    // Old products delete pannum
    await Product.deleteMany({});
    console.log("Old products deleted!");

    // Add images to each product
    const productsWithImages = products.map((p) => ({
      ...p,
      image: makeImage(p.name, p.category),
    }));

    // 100 products insert pannum
    const result = await Product.insertMany(productsWithImages);
    console.log(`${result.length} products added!`);

    // Category wise count
    const categories = {};
    products.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log("Category wise:", categories);

    mongoose.connection.close();
    console.log("Done! Connection closed.");
  } catch (err) {
    console.error("Error:", err.message);
    mongoose.connection.close();
  }
};

seedProducts();
