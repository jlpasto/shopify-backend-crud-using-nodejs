const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Product Types
  type Product {
    id: ID!
    title: String!
    description: String
    vendor: String
    productType: String
    tags: [String!]
    status: ProductStatus!
    variants: [ProductVariant!]!
    images: [ProductImage!]
    createdAt: String!
    updatedAt: String!
  }

  type ProductVariant {
    id: ID!
    title: String!
    price: Float!
    compareAtPrice: Float
    sku: String
    inventoryQuantity: Int!
    weight: Float
    weightUnit: WeightUnit
    requiresShipping: Boolean!
    taxable: Boolean!
    barcode: String
    createdAt: String!
    updatedAt: String!
  }

  type ProductImage {
    id: ID!
    src: String!
    altText: String
    width: Int
    height: Int
    createdAt: String!
  }

  # Enums
  enum ProductStatus {
    ACTIVE
    ARCHIVED
    DRAFT
  }

  enum WeightUnit {
    GRAMS
    KILOGRAMS
    OUNCES
    POUNDS
  }

  # Input Types
  input CreateProductInput {
    title: String!
    description: String
    vendor: String
    productType: String
    tags: [String!]
    status: ProductStatus = DRAFT
    variants: [CreateProductVariantInput!]!
    images: [CreateProductImageInput!]
  }

  input CreateProductVariantInput {
    title: String!
    price: Float!
    compareAtPrice: Float
    sku: String
    inventoryQuantity: Int = 0
    weight: Float
    weightUnit: WeightUnit = GRAMS
    requiresShipping: Boolean = true
    taxable: Boolean = true
    barcode: String
  }

  input CreateProductImageInput {
    src: String!
    altText: String
    width: Int
    height: Int
  }

  input UpdateProductInput {
    title: String
    description: String
    vendor: String
    productType: String
    tags: [String!]
    status: ProductStatus
  }

  input UpdateProductVariantInput {
    id: ID!
    title: String
    price: Float
    compareAtPrice: Float
    sku: String
    inventoryQuantity: Int
    weight: Float
    weightUnit: WeightUnit
    requiresShipping: Boolean
    taxable: Boolean
    barcode: String
  }

  # Response Types
  type ProductResponse {
    success: Boolean!
    message: String
    product: Product
    errors: [String!]
  }

  type ProductsResponse {
    success: Boolean!
    message: String
    products: [Product!]
    totalCount: Int
    errors: [String!]
  }

  type DeleteResponse {
    success: Boolean!
    message: String
    errors: [String!]
  }

  # Queries
  type Query {
    # Get all products with optional filtering
    products(
      status: ProductStatus
      vendor: String
      productType: String
      limit: Int = 10
      offset: Int = 0
    ): ProductsResponse!
    
    # Get single product by ID
    product(id: ID!): ProductResponse!
    
    # Search products by title or description
    searchProducts(query: String!, limit: Int = 10): ProductsResponse!
  }

  # Mutations
  type Mutation {
    # Create a new product
    createProduct(input: CreateProductInput!): ProductResponse!
    
    # Update an existing product
    updateProduct(id: ID!, input: UpdateProductInput!): ProductResponse!
    
    # Delete a product
    deleteProduct(id: ID!): DeleteResponse!
    
    # Add variant to product
    addProductVariant(productId: ID!, variant: CreateProductVariantInput!): ProductResponse!
    
    # Update product variant
    updateProductVariant(productId: ID!, variant: UpdateProductVariantInput!): ProductResponse!
    
    # Remove variant from product
    removeProductVariant(productId: ID!, variantId: ID!): ProductResponse!
    
    # Add image to product
    addProductImage(productId: ID!, image: CreateProductImageInput!): ProductResponse!
    
    # Remove image from product
    removeProductImage(productId: ID!, imageId: ID!): ProductResponse!
  }
`;

module.exports = typeDefs;