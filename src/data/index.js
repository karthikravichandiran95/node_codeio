const users = [
  { id: 1, name: "Niran", email: "niran@example.com" },
  { id: 2, name: "Kumar", email: "kumar@example.com" },
];

const products = [
  { id: 1, name: "iPhone 16", price: 79999, category: "mobile" },
  { id: 2, name: "iPhone 15", price: 69999, category: "mobile" },
  { id: 3, name: "Samsung S24", price: 74999, category: "mobile" },
  { id: 4, name: "OnePlus 12", price: 49999, category: "mobile" },
  { id: 5, name: "MacBook Air", price: 119999, category: "laptop" },
  { id: 6, name: "MacBook Pro", price: 199999, category: "laptop" },
  { id: 7, name: "Dell XPS 15", price: 149999, category: "laptop" },
  { id: 8, name: "HP Spectre", price: 129999, category: "laptop" },
  { id: 9, name: "AirPods Pro", price: 24999, category: "accessory" },
  { id: 10, name: "Apple Watch", price: 49999, category: "accessory" },
  { id: 11, name: "iPad Air", price: 59999, category: "tablet" },
  { id: 12, name: "Samsung Tab S9", price: 45999, category: "tablet" },
];

const orders = [
  { id: 1, userId: 1, productId: 1, quantity: 1, status: "pending" },
  { id: 2, userId: 2, productId: 3, quantity: 2, status: "confirmed" },
];

const categories = [
  { id: 1, name: "Mobile", description: "Smartphones and feature phones" },
  { id: 2, name: "Laptop", description: "Laptops and notebooks" },
  { id: 3, name: "Accessory", description: "Phone and laptop accessories" },
];

module.exports = { users, products, orders, categories };
