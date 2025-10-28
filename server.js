// server.js - Starter Express server for Week 2 assignment
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3173",
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
    }));

// Sample in-memory products database
let products = [
  {    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
    
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Middleware
app.use(express.json());

// CRUD ROUTES
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

//GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

//GET a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

//POST - Create a new product
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Please provide both name and price.' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product created successfully!', product: newProduct });
});

//PUT - Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Update only provided fields
  if (name) product.name = name;
  if (price) product.price = price;

  res.json({ message: 'Product updated successfully!', product });
});

//DELETE - Remove a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully! Bye!', deletedProduct });
});


//Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 