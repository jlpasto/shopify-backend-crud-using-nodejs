const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/products', productRoutes);

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