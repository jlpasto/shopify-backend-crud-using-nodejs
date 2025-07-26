const express = require('express');
const router = express.Router();
const ShopifyProductVariantService = require('../services/ShopifyProductVariantService');

// GET /api/product-variants/:id - Get product variant by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const gid = id.startsWith('gid://') ? id : `gid://shopify/ProductVariant/${id}`;
    
    const result = await ShopifyProductVariantService.getProductVariantById(gid);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    if (!result) {
      return res.status(404).json({ error: 'Product variant not found' });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error getting product variant:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/product-variants/bulk?ids=id1,id2,id3 - Get multiple product variants by IDs
router.get('/bulk', async (req, res) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'ids parameter is required' });
    }

    const ids = idsParam.split(',').map(id => {
      return id.startsWith('gid://') ? id : `gid://shopify/ProductVariant/${id}`;
    });
    
    const result = await ShopifyProductVariantService.getProductVariantsByIds(ids);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error getting product variants:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/product-variants/product/:productId - Get product variants by product ID
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const { first = 10, after } = req.query;
    
    const result = await ShopifyProductVariantService.getProductVariantsByProductId(productId, { 
      first: parseInt(first), 
      after 
    });
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error getting product variants by product ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/product-variants/product/:productId - Create product variants for a product
router.post('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
    const { variants } = req.body;
    
    if (!variants || !Array.isArray(variants)) {
      return res.status(400).json({ error: 'variants array is required in request body' });
    }
    
    const result = await ShopifyProductVariantService.createProductVariant(gid, variants);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating product variants:', err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
