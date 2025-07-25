const express = require('express');
const router = express.Router();
const ProductService = require('../services/ProductService');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const { status, vendor, productType, limit, offset } = req.query;
    const result = await ProductService.getAllProducts({
      status,
      vendor,
      productType,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await ProductService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProductService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 