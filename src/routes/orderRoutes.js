const express = require('express');
const router = express.Router();
const ShopifyOrderService = require('../services/ShopifyOrderService');

// GET /api/orders - List completed orders
router.get('/', async (req, res) => {
  try {
    const { first } = req.query;
    const orders = await ShopifyOrderService.getAllOrders({
      first: first ? parseInt(first) : 10,
    });
    if (orders.userErrors) {
      return res.status(400).json({ errors: orders.userErrors });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/bulk?ids=gid1,gid2,... - Get multiple orders by GIDs
router.get('/bulk', async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (!ids.length) {
      return res.status(400).json({ error: 'Missing or empty ids query parameter' });
    }
    const orders = await ShopifyOrderService.getOrdersByIds(ids);
    if (orders.userErrors) {
      return res.status(400).json({ errors: orders.userErrors });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id - Get a single order
router.get('/:id', async (req, res) => {
  try {
    const order = await ShopifyOrderService.getOrderById(req.params.id);
    if (order.userErrors) {
      return res.status(400).json({ errors: order.userErrors });
    }
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/orders/:id - Delete a completed order
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // If the id is not a global Shopify GID, convert it
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`;
    const result = await ShopifyOrderService.deleteOrder(gid);
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    res.json({ success: true, deletedId: result.deletedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id - Update an order's shipping address and note
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // If the id is not a global Shopify GID, convert it
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`;
    const input = { id: gid, ...req.body };
    const result = await ShopifyOrderService.updateOrder(input);
    if (result.userErrors && result.userErrors.length > 0) {
      return res.status(400).json({ errors: result.userErrors });
    }
    res.json(result.order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/node/:id - Get an order using QueryRoot.node and a fragment
router.get('/node/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // If the id is not a global Shopify GID, convert it
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`;
    const orderNode = await ShopifyOrderService.getOrderNodeById(gid);
    if (orderNode.userErrors) {
      return res.status(400).json({ errors: orderNode.userErrors });
    }
    res.json(orderNode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id/details - Retrieve a specific order with details
router.get('/:id/details', async (req, res) => {
  try {
    const id = req.params.id;
    // If the id is not a global Shopify GID, convert it
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`;
    const orderDetails = await ShopifyOrderService.getOrderDetailsById(gid);
    if (orderDetails.userErrors) {
      return res.status(400).json({ errors: orderDetails.userErrors });
    }
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id/metafields - Get metafields attached to an order
router.get('/:id/metafields', async (req, res) => {
  try {
    const id = req.params.id;
    // If the id is not a global Shopify GID, convert it
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`;
    const metafields = await ShopifyOrderService.getOrderMetafields(gid);
    if (metafields.userErrors) {
      return res.status(400).json({ errors: metafields.userErrors });
    }
    res.json(metafields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 