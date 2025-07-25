const { v4: uuidv4 } = require('uuid');
const ProductModel = require('../models/ProductModel');
const { validateProduct, validateVariant, validateImage } = require('../utils/validators');

class ProductService {
  static async getAllProducts({ status, vendor, productType, limit = 10, offset = 0 }) {
    const products = await ProductModel.findAll();
    
    // Apply filters
    let filteredProducts = products;
    
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }
    
    if (vendor) {
      filteredProducts = filteredProducts.filter(p => 
        p.vendor && p.vendor.toLowerCase().includes(vendor.toLowerCase())
      );
    }
    
    if (productType) {
      filteredProducts = filteredProducts.filter(p => 
        p.productType && p.productType.toLowerCase().includes(productType.toLowerCase())
      );
    }
    
    // Apply pagination
    const totalCount = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    return {
      products: paginatedProducts,
      totalCount,
    };
  }

  static async getProductById(id) {
    return await ProductModel.findById(id);
  }

  static async searchProducts(query, limit = 10) {
    const products = await ProductModel.findAll();
    const searchTerm = query.toLowerCase();
    
    const matchedProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    return matchedProducts.slice(0, limit);
  }

  static async createProduct(input) {
    // Validate input
    const validation = validateProduct(input);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const productId = uuidv4();
    
    // Create variants with IDs
    const variants = input.variants.map(variant => ({
      ...variant,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }));
    
    // Create images with IDs if provided
    const images = input.images ? input.images.map(image => ({
      ...image,
      id: uuidv4(),
      createdAt: now,
    })) : [];

    const product = {
      id: productId,
      title: input.title,
      description: input.description || '',
      vendor: input.vendor || '',
      productType: input.productType || '',
      tags: input.tags || [],
      status: input.status || 'DRAFT',
      variants,
      images,
      createdAt: now,
      updatedAt: now,
    };

    return await ProductModel.create(product);
  }

  static async updateProduct(id, input) {
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return null;
    }

    const updatedProduct = {
      ...existingProduct,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    return await ProductModel.update(id, updatedProduct);
  }

  static async deleteProduct(id) {
    return await ProductModel.delete(id);
  }

  static async addProductVariant(productId, variantInput) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return null;
    }

    const validation = validateVariant(variantInput);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const newVariant = {
      ...variantInput,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedProduct = {
      ...product,
      variants: [...product.variants, newVariant],
      updatedAt: now,
    };

    return await ProductModel.update(productId, updatedProduct);
  }

  static async updateProductVariant(productId, variantInput) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return null;
    }

    const variantIndex = product.variants.findIndex(v => v.id === variantInput.id);
    if (variantIndex === -1) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      ...variantInput,
      updatedAt: now,
    };

    const updatedProduct = {
      ...product,
      variants: updatedVariants,
      updatedAt: now,
    };

    return await ProductModel.update(productId, updatedProduct);
  }

  static async removeProductVariant(productId, variantId) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return null;
    }

    const variantExists = product.variants.some(v => v.id === variantId);
    if (!variantExists) {
      return null;
    }

    // Don't allow removing the last variant
    if (product.variants.length === 1) {
      throw new Error('Cannot remove the last variant. A product must have at least one variant.');
    }

    const updatedProduct = {
      ...product,
      variants: product.variants.filter(v => v.id !== variantId),
      updatedAt: new Date().toISOString(),
    };

    return await ProductModel.update(productId, updatedProduct);
  }

  static async addProductImage(productId, imageInput) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return null;
    }

    const validation = validateImage(imageInput);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const newImage = {
      ...imageInput,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const updatedProduct = {
      ...product,
      images: [...product.images, newImage],
      updatedAt: new Date().toISOString(),
    };

    return await ProductModel.update(productId, updatedProduct);
  }

  static async removeProductImage(productId, imageId) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return null;
    }

    const imageExists = product.images.some(img => img.id === imageId);
    if (!imageExists) {
      return null;
    }

    const updatedProduct = {
      ...product,
      images: product.images.filter(img => img.id !== imageId),
      updatedAt: new Date().toISOString(),
    };

    return await ProductModel.update(productId, updatedProduct);
  }
}

module.exports = ProductService;