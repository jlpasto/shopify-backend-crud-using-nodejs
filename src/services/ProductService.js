const ShopifyProductService = require('./ShopifyProductService');

class ProductService {
  static async getAllProducts({ limit = 10, offset = 0 }) {
    // Fetch all products from Shopify
    return await ShopifyProductService.getAllProducts({ limit, offset });
  }

  static async getProductById(id) {
    // Fetch a single product from Shopify
    return await ShopifyProductService.getProductById(id);
  }

  static async createProduct(input) {
    // Create product in Shopify only
    return await ShopifyProductService.createProduct(input);
  }

  static async updateProduct(id, input) {
    // Update product in Shopify only
    return await ShopifyProductService.updateProduct(id, input);
  }

  static async deleteProduct(id) {
    // Delete product in Shopify only
    return await ShopifyProductService.deleteProduct(id);
  }
}

module.exports = ProductService;