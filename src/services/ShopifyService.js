const axios = require('axios');

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const BASE_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-04`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

class ShopifyService {
  static async getAllProducts({ limit = 10 }) {
    try {
      const response = await axiosInstance.get('/products.json', {
        params: { limit }
      });
      return {
        products: response.data.products,
        totalCount: response.data.products.length
      };
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  }

  static async getProductById(id) {
    try {
      const response = await axiosInstance.get(`/products/${id}.json`);
      return response.data.product;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  }

  static async createProduct(product) {
    try {
      const shopifyProduct = {
        product: {
          title: product.title,
          body_html: product.description,
          vendor: product.vendor,
          product_type: product.productType,
          tags: product.tags,
          variants: product.variants.map(v => ({
            title: v.title,
            price: v.price,
            sku: v.sku,
            inventory_quantity: v.inventoryQuantity,
            weight: v.weight,
            weight_unit: v.weightUnit || 'g',
          })),
          images: product.images?.map(img => ({ src: img.src })) || [],
        }
      };
      const response = await axiosInstance.post('/products.json', shopifyProduct);
      return response.data;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  }

  static async updateProduct(shopifyProductId, product) {
    try {
      const shopifyProduct = {
        product: {
          id: shopifyProductId,
          title: product.title,
          body_html: product.description,
          vendor: product.vendor,
          product_type: product.productType,
          tags: product.tags,
          variants: product.variants.map(v => ({
            title: v.title,
            price: v.price,
            sku: v.sku,
            inventory_quantity: v.inventoryQuantity,
            weight: v.weight,
            weight_unit: v.weightUnit || 'g',
          })),
          images: product.images?.map(img => ({ src: img.src })) || [],
        }
      };
      const response = await axiosInstance.put(`/products/${shopifyProductId}.json`, shopifyProduct);
      return response.data;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  }

  static async deleteProduct(shopifyProductId) {
    try {
      const response = await axiosInstance.delete(`/products/${shopifyProductId}.json`);
      return response.data;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  }
}

module.exports = ShopifyService; 