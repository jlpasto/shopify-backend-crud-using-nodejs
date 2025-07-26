const express = require('express');
const router = express.Router();
const ShopifyProductOptionService = require('../services/ShopifyProductOptionService');

// POST /api/product-options/:productId - Create product options and values
router.post('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
    const { options, variantStrategy } = req.body;
    
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'options array is required in request body' });
    }
    
    const result = await ShopifyProductOptionService.createProductOptions(gid, options, variantStrategy);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating product options:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/product-options/:productId - Delete product options
router.delete('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
    const { options, strategy } = req.body;
    
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: 'options array is required in request body' });
    }
    
    const result = await ShopifyProductOptionService.deleteProductOptions(gid, options, strategy);
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error deleting product options:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/product-options/:productId - Update product options and their values
router.put('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const gid = productId.startsWith('gid://') ? productId : `gid://shopify/Product/${productId}`;
    const { 
      option, 
      optionValuesToAdd, 
      optionValuesToUpdate, 
      optionValuesToDelete, 
      variantStrategy 
    } = req.body;
    
    if (!option) {
      return res.status(400).json({ error: 'option object is required in request body' });
    }
    
    const result = await ShopifyProductOptionService.updateProductOption(
      gid, 
      option, 
      optionValuesToAdd, 
      optionValuesToUpdate, 
      optionValuesToDelete, 
      variantStrategy
    );
    
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error updating product option:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 