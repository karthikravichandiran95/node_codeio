/**
 * Seed script - Creates categories
 * Run: node src/seeds/categorySeed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const categories = [
  { name: "mobile", description: "Smartphones and mobile devices" },
  { name: "laptop", description: "Laptops and notebooks" },
  { name: "audio", description: "Headphones, earbuds and speakers" },
  { name: "accessory", description: "Watches, keyboards, mice and more" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...\n");

    await Category.deleteMany({});
    console.log("Old categories deleted!\n");

    const created = await Category.insertMany(categories);
    console.log(`${created.length} categories inserted!\n`);

    created.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} - ${c.description}`);
    });

    await mongoose.disconnect();
    console.log("\nDone!");
    process.exit(0);
  } catch (error) {
    console.log("Seed Error:", error.message);
    process.exit(1);
  }
};

seedCategories();
