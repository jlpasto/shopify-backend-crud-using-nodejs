const ProductService = require('../../services/ProductService');

const productResolvers = {
  Query: {
    products: async (_, args) => {
      try {
        const result = await ProductService.getAllProducts(args);
        return {
          success: true,
          products: result.products,
          totalCount: result.totalCount,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          products: [],
          totalCount: 0,
          errors: [error.message],
        };
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await ProductService.getProductById(id);
        if (!product) {
          return {
            success: false,
            message: 'Product not found',
            product: null,
            errors: ['Product not found'],
          };
        }
        return {
          success: true,
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          product: null,
          errors: [error.message],
        };
      }
    },

    searchProducts: async (_, { query, limit }) => {
      try {
        const result = await ProductService.searchProducts(query, limit);
        return {
          success: true,
          products: result,
          totalCount: result.length,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          products: [],
          totalCount: 0,
          errors: [error.message],
        };
      }
    },
  },

  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const product = await ProductService.createProduct(input);
        return {
          success: true,
          message: 'Product created successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to create product',
          product: null,
          errors: [error.message],
        };
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const product = await ProductService.updateProduct(id, input);
        if (!product) {
          return {
            success: false,
            message: 'Product not found',
            product: null,
            errors: ['Product not found'],
          };
        }
        return {
          success: true,
          message: 'Product updated successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to update product',
          product: null,
          errors: [error.message],
        };
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const success = await ProductService.deleteProduct(id);
        if (!success) {
          return {
            success: false,
            message: 'Product not found',
            errors: ['Product not found'],
          };
        }
        return {
          success: true,
          message: 'Product deleted successfully',
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to delete product',
          errors: [error.message],
        };
      }
    },

    addProductVariant: async (_, { productId, variant }) => {
      try {
        const product = await ProductService.addProductVariant(productId, variant);
        if (!product) {
          return {
            success: false,
            message: 'Product not found',
            product: null,
            errors: ['Product not found'],
          };
        }
        return {
          success: true,
          message: 'Variant added successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to add variant',
          product: null,
          errors: [error.message],
        };
      }
    },

    updateProductVariant: async (_, { productId, variant }) => {
      try {
        const product = await ProductService.updateProductVariant(productId, variant);
        if (!product) {
          return {
            success: false,
            message: 'Product or variant not found',
            product: null,
            errors: ['Product or variant not found'],
          };
        }
        return {
          success: true,
          message: 'Variant updated successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to update variant',
          product: null,
          errors: [error.message],
        };
      }
    },

    removeProductVariant: async (_, { productId, variantId }) => {
      try {
        const product = await ProductService.removeProductVariant(productId, variantId);
        if (!product) {
          return {
            success: false,
            message: 'Product or variant not found',
            product: null,
            errors: ['Product or variant not found'],
          };
        }
        return {
          success: true,
          message: 'Variant removed successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to remove variant',
          product: null,
          errors: [error.message],
        };
      }
    },

    addProductImage: async (_, { productId, image }) => {
      try {
        const product = await ProductService.addProductImage(productId, image);
        if (!product) {
          return {
            success: false,
            message: 'Product not found',
            product: null,
            errors: ['Product not found'],
          };
        }
        return {
          success: true,
          message: 'Image added successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to add image',
          product: null,
          errors: [error.message],
        };
      }
    },

    removeProductImage: async (_, { productId, imageId }) => {
      try {
        const product = await ProductService.removeProductImage(productId, imageId);
        if (!product) {
          return {
            success: false,
            message: 'Product or image not found',
            product: null,
            errors: ['Product or image not found'],
          };
        }
        return {
          success: true,
          message: 'Image removed successfully',
          product,
          errors: [],
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to remove image',
          product: null,
          errors: [error.message],
        };
      }
    },
  },
};

module.exports = productResolvers;