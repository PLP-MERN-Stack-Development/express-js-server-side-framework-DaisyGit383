// routes/productRoute.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");

let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
];

const router = express.Router();

// GET all products (with search + pagination)
 router.get("/", (req, res) => {
  const { name, category, page = 1, limit = 5 } = req.query;

  let results = products;

  // Search by name
  if (name) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by category
  if (category) {
    results = results.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  //Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    totalProducts: results.length,
    currentPage: Number(page),
    totalPages: Math.ceil(results.length / limit),
    products: paginatedResults,
  });
});

//GET single product by ID
 router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});


//POST - Create a new product
 router.post("/", (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock ?? true, // default true
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

//PUT - Update an existing product
 router.put("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, description, price, category, inStock } = req.body;

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.inStock = inStock !== undefined ? inStock : product.inStock;

  res.json(product);
});

//DELETE - Remove a product
 router.delete("/:id", (req, res) => {
  const exists = products.some((p) => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ message: "Product not found" });
  }

  products = products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Product deleted successfully" });
});

module.exports = router;
