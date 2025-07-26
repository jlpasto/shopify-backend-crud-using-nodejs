const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const draftOrderRoutes = require('./routes/draftOrderRoutes');
const productVariantRoutes = require('./routes/productVariantRoutes');
const productOptionRoutes = require('./routes/productOptionRoutes');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/draft-order', draftOrderRoutes);
  app.use('/api/product-variants', productVariantRoutes);
  app.use('/api/product-options', productOptionRoutes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 REST API server ready at http://localhost:${PORT}`);
  });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});