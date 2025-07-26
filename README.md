# Shopify Product & Order CRUD Backend

## API Endpoints

All endpoints interact directly with your Shopify store. You must have your Shopify access token and store domain set in your `.env` file.

---

## Sample Commands (Windows PowerShell)

### Product Endpoints

#### List Products
```powershell
curl http://localhost:3000/api/products
```

#### Get Product by ID
```powershell
curl http://localhost:3000/api/products/<PRODUCT_ID>
```

**Example:**
```powershell
curl http://localhost:3000/api/products/108828309
```

**Or with full GID:**
```powershell
curl http://localhost:3000/api/products/gid://shopify/Product/108828309
```

#### Create Product
```powershell
curl -Method POST http://localhost:3000/api/products `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Test Product"
  }'
```

#### Create Product with Options
```powershell
curl -Method POST http://localhost:3000/api/products `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Cool Socks",
    "productOptions": [
      {
        "name": "Color",
        "values": [
          { "name": "Red" },
          { "name": "Blue" }
        ]
      },
      {
        "name": "Size",
        "values": [
          { "name": "Small" },
          { "name": "Large" }
        ]
      }
    ]
  }'
```

#### Update Product (Simple)
```powershell
curl -Method PUT http://localhost:3000/api/products/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Updated Product Title"
  }'
```

#### Update Product (Comprehensive)
```powershell
curl -Method PUT http://localhost:3000/api/products/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Eco-Friendly Bamboo Water Bottle",
    "handle": "eco-bamboo-water-bottle",
    "vendor": "EcoLife Products",
    "productType": "Water Bottles",
    "status": "ACTIVE",
    "tags": ["eco-friendly", "bamboo", "sustainable", "water bottle", "reusable"],
    "seo": {
      "title": "Eco-Friendly Bamboo Water Bottle - Sustainable Hydration | EcoLife",
      "description": "Discover our premium bamboo water bottle made from 100% natural materials. Perfect for sustainable living. Free shipping available."
    }
  }'
```

#### Delete Product
```powershell
curl -Method DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```

**Example:**
```powershell
curl -Method DELETE http://localhost:3000/api/products/8125595189348
```

**Or with full GID:**
```powershell
curl -Method DELETE http://localhost:3000/api/products/gid://shopify/Product/8125595189348
```

---

### Product Variant Endpoints

#### Get Product Variant by ID
```powershell
curl http://localhost:3000/api/product-variants/<VARIANT_ID>
```

**Example:**
```powershell
curl http://localhost:3000/api/product-variants/43729076
```

**Or with full GID:**
```powershell
curl http://localhost:3000/api/product-variants/gid://shopify/ProductVariant/43729076
```

**Note:** The route automatically converts numeric IDs to GID format.

#### Get Multiple Product Variants by IDs
```powershell
curl http://localhost:3000/api/product-variants/bulk?ids=<VARIANT_ID1>,<VARIANT_ID2>,<VARIANT_ID3>
```

**Example:**
```powershell
curl http://localhost:3000/api/product-variants/bulk?ids=30322695,43729076,113711323
```

**Or with full GIDs:**
```powershell
curl http://localhost:3000/api/product-variants/bulk?ids=gid://shopify/ProductVariant/30322695,gid://shopify/ProductVariant/43729076,gid://shopify/ProductVariant/113711323
```

**Note:** The route automatically converts numeric IDs to GID format.

#### Get Product Variants by Product ID
```powershell
curl http://localhost:3000/api/product-variants/product/<PRODUCT_ID>
```

**Example:**
```powershell
curl http://localhost:3000/api/product-variants/product/20995642
```

**With pagination:**
```powershell
curl http://localhost:3000/api/product-variants/product/20995642?first=5
```

**With cursor pagination:**
```powershell
curl http://localhost:3000/api/product-variants/product/20995642?first=5&after=YOUR_CURSOR
```

**Note:** Uses numeric product ID (not GID) for the query parameter.

#### Create Product Variants
```powershell
curl -Method POST http://localhost:3000/api/product-variants/product/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "variants": [
      {
        "price": 15.99,
        "compareAtPrice": 19.99,
        "optionValues": [
          {
            "name": "Golden",
            "optionId": "gid://shopify/ProductOption/328272167"
          }
        ]
      }
    ]
  }'
```

**Example:**
```powershell
curl -Method POST http://localhost:3000/api/product-variants/product/20995642 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "variants": [
      {
        "price": 15.99,
        "compareAtPrice": 19.99,
        "optionValues": [
          {
            "name": "Golden",
            "optionId": "gid://shopify/ProductOption/328272167"
          }
        ]
      }
    ]
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Create Product Options and Values
```powershell
curl -Method POST http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      {
        "name": "Color",
        "values": [
          { "name": "Blue" },
          { "name": "Red" }
        ]
      },
      {
        "name": "Size",
        "values": [
          { "name": "Small" },
          { "name": "Medium" }
        ]
      }
    ]
  }'
```

**Example:**
```powershell
curl -Method POST http://localhost:3000/api/product-options/1072481154 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      {
        "name": "Color",
        "values": [
          { "name": "Blue" },
          { "name": "Red" }
        ]
      },
      {
        "name": "Size",
        "values": [
          { "name": "Small" },
          { "name": "Medium" }
        ]
      }
    ]
  }'
```

**With variant strategy:**
```powershell
curl -Method POST http://localhost:3000/api/product-options/1072481154 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      {
        "name": "Color",
        "values": [
          { "name": "Blue" },
          { "name": "Red" }
        ]
      }
    ],
    "variantStrategy": "APPEND"
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Delete Product Options (No Associated Variants)
```powershell
curl -Method DELETE http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      "gid://shopify/ProductOption/328272168"
    ]
  }'
```

**Example:**
```powershell
curl -Method DELETE http://localhost:3000/api/product-options/20995642 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      "gid://shopify/ProductOption/328272168"
    ]
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Delete Product Options (With Associated Variants)
```powershell
curl -Method DELETE http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      "gid://shopify/ProductOption/328272167"
    ],
    "strategy": "POSITION"
  }'
```

**Example:**
```powershell
curl -Method DELETE http://localhost:3000/api/product-options/20995642 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "options": [
      "gid://shopify/ProductOption/328272167"
    ],
    "strategy": "POSITION"
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Update Product Option Name and Position
```powershell
curl -Method PUT http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "option": {
      "id": "gid://shopify/ProductOption/1064576536",
      "position": 1,
      "name": "Tint"
    }
  }'
```

**Example:**
```powershell
curl -Method PUT http://localhost:3000/api/product-options/1072481071 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "option": {
      "id": "gid://shopify/ProductOption/1064576536",
      "position": 1,
      "name": "Tint"
    }
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Add and Update Product Option Values
```powershell
curl -Method PUT http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "option": {
      "id": "gid://shopify/ProductOption/1064576526"
    },
    "optionValuesToAdd": [
      {
        "name": "Yellow"
      },
      {
        "name": "Red"
      }
    ],
    "optionValuesToUpdate": [
      {
        "id": "gid://shopify/ProductOptionValue/1054672275",
        "name": "Purple"
      }
    ]
  }'
```

**Example:**
```powershell
curl -Method PUT http://localhost:3000/api/product-options/1072481063 `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "option": {
      "id": "gid://shopify/ProductOption/1064576526"
    },
    "optionValuesToAdd": [
      {
        "name": "Yellow"
      },
      {
        "name": "Red"
      }
    ],
    "optionValuesToUpdate": [
      {
        "id": "gid://shopify/ProductOptionValue/1054672275",
        "name": "Purple"
      }
    ]
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

#### Update Product Option with Variant Strategy
```powershell
curl -Method PUT http://localhost:3000/api/product-options/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "option": {
      "id": "gid://shopify/ProductOption/1064576526",
      "name": "Updated Color"
    },
    "optionValuesToAdd": [
      {
        "name": "Orange"
      }
    ],
    "variantStrategy": "APPEND"
  }'
```

**Note:** The route automatically converts numeric product ID to GID format.

---

### Order Endpoints (Completed Orders)

#### List Orders
```powershell
curl http://localhost:3000/api/orders
```

#### Get Order by ID
```powershell
curl http://localhost:3000/api/orders/<ORDER_ID>
```

#### Get Multiple Orders by GIDs
```powershell
curl http://localhost:3000/api/orders/bulk?ids=gid://shopify/Order/123,gid://shopify/Order/456
```

#### Update Order Shipping Address and Note
```powershell
curl -Method PUT http://localhost:3000/api/orders/<ORDER_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "shippingAddress": {
      "address1": "190 MacLaren",
      "city": "Sudbury",
      "province": "Ontario",
      "zip": "K2P0V6",
      "country": "Canada"
    },
    "note": "Please gift wrap the snowboard."
  }'
```

#### Delete Order
```powershell
curl -Method DELETE http://localhost:3000/api/orders/<ORDER_ID>
```

#### Get Order Node by GID
```powershell
curl http://localhost:3000/api/orders/node/<ORDER_GID>
```

#### Get Order Details
```powershell
curl http://localhost:3000/api/orders/<ORDER_ID>/details
```

#### Get Order Metafields
```powershell
curl http://localhost:3000/api/orders/<ORDER_ID>/metafields
```

---

### Draft Order Endpoints

#### List Draft Orders
```powershell
curl http://localhost:3000/api/draft-order
```

#### Create Draft Order
```powershell
curl -Method POST http://localhost:3000/api/draft-order `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "input": { ... } }'
```

#### Update Draft Order
```powershell
curl -Method PUT http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "input": { ... } }'
```

#### Delete Draft Order
```powershell
curl -Method DELETE http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID>
```

---

## Environment Variables
- `SHOPIFY_STORE_DOMAIN` (e.g. `yourstore.myshopify.com`)
- `SHOPIFY_ACCESS_TOKEN` (from Shopify admin)

## Notes
- All data is managed in Shopify only. No local database is used.
- Errors from Shopify are logged to the server console for debugging.
- Use `/api/orders` for completed orders and `/api/draft-order` for draft orders.