/**
 * Seed script - Creates 24 products with image URLs
 * Run: node src/seeds/productSeed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  // ========== MOBILES (6) ==========
  {
    name: "iPhone 15 Pro Max",
    price: 159900,
    category: "mobile",
    stock: 25,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 134999,
    category: "mobile",
    stock: 30,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Google Pixel 8 Pro",
    price: 106999,
    category: "mobile",
    stock: 20,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "OnePlus 12",
    price: 64999,
    category: "mobile",
    stock: 35,
    image: "https://images.unsplash.com/photo-1609692814857-5b11f4bb4178?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "iQOO 12",
    price: 52999,
    category: "mobile",
    stock: 40,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Nothing Phone 2",
    price: 44999,
    category: "mobile",
    stock: 15,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&q=80",
  },

  // ========== LAPTOPS (6) ==========
  {
    name: "MacBook Air M3",
    price: 114900,
    category: "laptop",
    stock: 18,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Dell XPS 15",
    price: 149990,
    category: "laptop",
    stock: 12,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "HP Spectre x360",
    price: 139999,
    category: "laptop",
    stock: 10,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    price: 164999,
    category: "laptop",
    stock: 8,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "ASUS ROG Zephyrus G14",
    price: 159999,
    category: "laptop",
    stock: 14,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Acer Nitro 5",
    price: 74999,
    category: "laptop",
    stock: 22,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&q=80",
  },

  // ========== AUDIO (6) ==========
  {
    name: "Apple AirPods Pro 2",
    price: 24900,
    category: "audio",
    stock: 50,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Sony WH-1000XM5",
    price: 29990,
    category: "audio",
    stock: 28,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "JBL Charge 5",
    price: 17999,
    category: "audio",
    stock: 35,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Samsung Galaxy Buds 2 Pro",
    price: 17999,
    category: "audio",
    stock: 30,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Bose QuietComfort 45",
    price: 32900,
    category: "audio",
    stock: 20,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "boAt Rockerz 550",
    price: 1799,
    category: "audio",
    stock: 60,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&q=80",
  },

  // ========== ACCESSORIES (6) ==========
  {
    name: "Apple Watch Ultra 2",
    price: 89900,
    category: "accessory",
    stock: 15,
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Logitech MX Master 3S Mouse",
    price: 9495,
    category: "accessory",
    stock: 25,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Keychron K2 Keyboard",
    price: 7999,
    category: "accessory",
    stock: 30,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Anker PowerBank 20000mAh",
    price: 3999,
    category: "accessory",
    stock: 45,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Sony Alpha A7 III Camera",
    price: 189990,
    category: "accessory",
    stock: 10,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "iPad Air M2",
    price: 69900,
    category: "accessory",
    stock: 20,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&q=80",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...\n");

    // Delete old products
    await Product.deleteMany({});
    console.log("Old products deleted!\n");

    // Insert all 24 products
    const created = await Product.insertMany(products);
    console.log(`${created.length} products inserted!\n`);

    // Show results
    console.log("Products added:");
    created.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - Rs.${p.price} [${p.category}]`);
    });

    await mongoose.disconnect();
    console.log("\nDone!");
    process.exit(0);
  } catch (error) {
    console.log("Seed Error:", error.message);
    process.exit(1);
  }
};

seedProducts();
