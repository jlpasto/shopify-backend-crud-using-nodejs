const express = require('express');
const router = express.Router();
const ShopifyDraftOrdersService = require('../services/ShopifyDraftOrdersService');

// GET /api/draft-order - List draft orders
router.get('/', async (req, res) => {
  try {
    const { first } = req.query;
    const draftOrders = await ShopifyDraftOrdersService.getAllDraftOrders({
      first: first ? parseInt(first) : 10,
    });
    res.json(draftOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/draft-order - Create a draft order
router.post('/', async (req, res) => {
  try {
    const result = await ShopifyDraftOrdersService.createDraftOrder(req.body.input);
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    // Return the full draftOrder object
    res.status(201).json(result.draftOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/draft-order/:id - Update a draft order
router.put('/:id', async (req, res) => {
  try {
    const result = await ShopifyDraftOrdersService.updateDraftOrder(req.params.id, req.body.input);
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    // Return the full draftOrder object
    res.json(result.draftOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/draft-order/:id - Delete a draft order
router.delete('/:id', async (req, res) => {
  try {
    const result = await ShopifyDraftOrdersService.deleteDraftOrder(req.params.id);
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    res.json({ success: true, deletedId: result.deletedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 