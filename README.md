# Shopify Product CRUD Backend

A modular GraphQL backend for managing Shopify products with full CRUD functionality. Built with Node.js using CommonJS modules for easy maintenance and scalability.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete products
- **GraphQL API**: Modern GraphQL endpoint with introspection and playground
- **Modular Architecture**: Clean separation of concerns for maintainability
- **Product Variants**: Full support for product variants with individual properties
- **Product Images**: Image management with metadata support
- **Search & Filtering**: Search products and filter by status, vendor, product type
- **Validation**: Comprehensive input validation with detailed error messages
- **JSON Database**: Simple file-based storage (easily replaceable with real database)

## 📁 Project Structure

```
src/
├── server.js                 # Main server setup and configuration
├── graphql/
│   ├── typeDefs.js           # GraphQL schema definitions
│   └── resolvers/
│       ├── index.js          # Resolver aggregator
│       └── productResolvers.js # Product-specific resolvers
├── services/
│   └── ProductService.js     # Business logic layer
├── models/
│   └── ProductModel.js       # Data access layer
├── database/
│   ├── connection.js         # Database connection management
│   └── data.json            # JSON database file
└── utils/
    ├── validators.js         # Input validation utilities
    └── constants.js          # Application constants
```

## 🛠 Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   # .env file is already configured with defaults
   PORT=4000
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode with auto-restart
   ```

4. **Access the GraphQL Playground:**
   Open http://localhost:4000/graphql in your browser

## 🔧 API Usage

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: Available in development mode

### Sample Queries & Mutations

#### Create a Product
```graphql
mutation CreateProduct {
  createProduct(input: {
    title: "Sample T-Shirt"
    description: "A comfortable cotton t-shirt"
    vendor: "MyBrand"
    productType: "Apparel"
    tags: ["clothing", "t-shirt", "cotton"]
    status: ACTIVE
    variants: [{
      title: "Small / Red"
      price: 29.99
      sku: "TSHIRT-SM-RED"
      inventoryQuantity: 100
      weight: 200
      weightUnit: GRAMS
    }]
    images: [{
      src: "https://example.com/tshirt.jpg"
      altText: "Red T-Shirt"
      width: 800
      height: 600
    }]
  }) {
    success
    message
    errors
    product {
      id
      title
      status
      variants {
        id
        title
        price
        sku
      }
    }
  }
}
```

#### Get All Products
```graphql
query GetProducts {
  products(limit: 10, offset: 0) {
    success
    totalCount
    products {
      id
      title
      description
      vendor
      status
      variants {
        id
        title
        price
        inventoryQuantity
      }
      images {
        id
        src
        altText
      }
    }
  }
}
```

#### Update a Product
```graphql
mutation UpdateProduct {
  updateProduct(
    id: "your-product-id"
    input: {
      title: "Updated T-Shirt Title"
      status: ACTIVE
    }
  ) {
    success
    message
    product {
      id
      title
      status
    }
  }
}
```

#### Search Products
```graphql
query SearchProducts {
  searchProducts(query: "t-shirt", limit: 5) {
    success
    products {
      id
      title
      description
      vendor
    }
  }
}
```

#### Delete a Product
```graphql
mutation DeleteProduct {
  deleteProduct(id: "your-product-id") {
    success
    message
    errors
  }
}
```

## 📊 Data Models

### Product
- `id`: Unique identifier
- `title`: Product name (required)
- `description`: Product description
- `vendor`: Brand or manufacturer
- `productType`: Category classification
- `tags`: Array of tags for organization
- `status`: ACTIVE, DRAFT, or ARCHIVED
- `variants`: Array of product variants (required)
- `images`: Array of product images
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

### Product Variant
- `id`: Unique identifier
- `title`: Variant name (e.g., "Small / Red")
- `price`: Selling price (required)
- `compareAtPrice`: Original price for sale display
- `sku`: Stock keeping unit
- `inventoryQuantity`: Available stock
- `weight`: Physical weight
- `weightUnit`: GRAMS, KILOGRAMS, OUNCES, or POUNDS
- `requiresShipping`: Boolean flag
- `taxable`: Boolean flag
- `barcode`: Product barcode

### Product Image
- `id`: Unique identifier
- `src`: Image URL (required)
- `altText`: Accessibility text
- `width`: Image width in pixels
- `height`: Image height in pixels

## 🔒 Validation Rules

- **Products**: Must have title and at least one variant
- **Variants**: Must have title and valid price (0-999999)
- **Images**: Must have valid URL format
- **Inventory**: Cannot be negative
- **Weights**: Must be positive numbers

## 🚀 Extending the Application

### Adding a Real Database
Replace the JSON file storage by:

1. **Install database driver** (e.g., `npm add mongoose` for MongoDB)
2. **Update `src/database/connection.js`** with real database connection
3. **Modify `src/models/ProductModel.js`** to use database queries
4. **No changes needed** in services or resolvers

### Adding Authentication
1. **Install JWT library**: `npm add jsonwebtoken`
2. **Add middleware** in `src/server.js`
3. **Update context** in Apollo Server setup
4. **Add auth checks** in resolvers

### Adding More Features
- **Categories**: Extend schema and models
- **Inventory tracking**: Add inventory management
- **Price rules**: Implement discount logic
- **SEO fields**: Add meta descriptions, titles
- **Multi-currency**: Extend pricing model

## 🧪 Testing

The project is structured for easy testing:

```bash
# Add testing dependencies
npm add --save-dev jest supertest

# Test structure example:
tests/
├── unit/
│   ├── services/
│   └── utils/
└── integration/
    └── graphql/
```

## 🐛 Error Handling

All operations return structured responses:
```json
{
  "success": boolean,
  "message": "string",
  "data": object,
  "errors": ["array of error messages"]
}
```

## 📝 Contributing

1. Follow the modular structure
2. Add validation for new fields
3. Update schema definitions
4. Write comprehensive error messages
5. Maintain backwards compatibility

## 🔧 Configuration

Environment variables:
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment mode
- Database connection strings (when implementing real database)

This backend provides a solid foundation for a Shopify-like product management system with room for extensive customization and scaling.