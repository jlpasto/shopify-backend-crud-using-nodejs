# Shopify Product & Order CRUD Backend

## API Endpoints

All endpoints interact directly with your Shopify store. You must have your Shopify access token and store domain set in your `.env` file.

---

## Sample Commands

### Product Endpoints

#### Create Product
**Windows (PowerShell):**
```powershell
curl -Method POST http://localhost:3000/api/products `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Test Product",
    "description": "A sample product for Shopify sync.",
    "vendor": "Your Brand",
    "productType": "T-Shirt",
    "tags": ["summer", "cotton"],
    "variants": [
      {
        "title": "Small",
        "price": 19.99,
        "sku": "TSHIRT-SM",
        "inventoryQuantity": 50,
        "weight": 200,
        "weightUnit": "g"
      }
    ],
    "images": [
      { "src": "https://example.com/image1.jpg" }
    ]
  }'
```
**Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "A sample product for Shopify sync.",
    "vendor": "Your Brand",
    "productType": "T-Shirt",
    "tags": ["summer", "cotton"],
    "variants": [
      {
        "title": "Small",
        "price": 19.99,
        "sku": "TSHIRT-SM",
        "inventoryQuantity": 50,
        "weight": 200,
        "weightUnit": "g"
      }
    ],
    "images": [
      { "src": "https://example.com/image1.jpg" }
    ]
  }'
```

#### Get All Products
**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/products
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/products
```

#### Get Product by ID
**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/products/<PRODUCT_ID>
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/products/<PRODUCT_ID>
```

#### Update Product
**Windows (PowerShell):**
```powershell
curl -Method PUT http://localhost:3000/api/products/<PRODUCT_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "title": "Updated Product Title",
    "description": "Updated description.",
    "vendor": "Your Brand",
    "productType": "T-Shirt",
    "tags": ["summer", "cotton"],
    "variants": [
      {
        "title": "Small",
        "price": 21.99,
        "sku": "TSHIRT-SM",
        "inventoryQuantity": 40,
        "weight": 200,
        "weightUnit": "g"
      }
    ],
    "images": [
      { "src": "https://example.com/image1.jpg" }
    ]
  }'
```
**Linux/macOS (bash):**
```bash
curl -X PUT http://localhost:3000/api/products/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Product Title",
    "description": "Updated description.",
    "vendor": "Your Brand",
    "productType": "T-Shirt",
    "tags": ["summer", "cotton"],
    "variants": [
      {
        "title": "Small",
        "price": 21.99,
        "sku": "TSHIRT-SM",
        "inventoryQuantity": 40,
        "weight": 200,
        "weightUnit": "g"
      }
    ],
    "images": [
      { "src": "https://example.com/image1.jpg" }
    ]
  }'
```

#### Delete Product
**Windows (PowerShell):**
```powershell
curl -Method DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```
**Linux/macOS (bash):**
```bash
curl -X DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```

---

### Order Endpoints (Completed Orders)

#### List Orders
**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/orders
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/orders
```

#### Get Order by ID
**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/orders/<ORDER_ID>
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/orders/<ORDER_ID>
```

#### Update Order Shipping Address and Note
**Windows (PowerShell):**
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
**Linux/macOS (bash):**
```bash
curl -X PUT http://localhost:3000/api/orders/<ORDER_ID> \
  -H "Content-Type: application/json" \
  -d '{
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
**Windows (PowerShell):**
```powershell
curl -Method DELETE http://localhost:3000/api/orders/<ORDER_ID>
```
**Linux/macOS (bash):**
```bash
curl -X DELETE http://localhost:3000/api/orders/<ORDER_ID>
```

---

### Draft Order Endpoints

#### List Draft Orders
**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/draft-order
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/draft-order
```

#### Create Draft Order
**Windows (PowerShell):**
```powershell
curl -Method POST http://localhost:3000/api/draft-order `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "input": { ... } }'
```
**Linux/macOS (bash):**
```bash
curl -X POST http://localhost:3000/api/draft-order \
  -H "Content-Type: application/json" \
  -d '{ "input": { ... } }'
```

#### Update Draft Order
**Windows (PowerShell):**
```powershell
curl -Method PUT http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID> `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "input": { ... } }'
```
**Linux/macOS (bash):**
```bash
curl -X PUT http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID> \
  -H "Content-Type: application/json" \
  -d '{ "input": { ... } }'
```

#### Delete Draft Order
**Windows (PowerShell):**
```powershell
curl -Method DELETE http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID>
```
**Linux/macOS (bash):**
```bash
curl -X DELETE http://localhost:3000/api/draft-order/<DRAFT_ORDER_ID>
```

---

#### List Draft Orders
This endpoint lists all Shopify draft orders.

**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/orders/draft-orders
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/orders/draft-orders
```

You can use query parameters like `first`, `after`, or `query` for pagination and filtering, e.g.:
```powershell
curl http://localhost:3000/api/orders/draft-orders?first=20
```

---

#### Get Metafields for an Order
This endpoint fetches the first 3 metafields attached to an order.

**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/orders/148977776/metafields
```
**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/orders/148977776/metafields
```

You can also use the full Shopify GID:
```powershell
curl http://localhost:3000/api/orders/gid://shopify/Order/148977776/metafields
```

**Response Example:**
```json
{
  "edges": [
    {
      "node": {
        "namespace": "my_fields",
        "key": "purchase_order",
        "value": "123"
      }
    }
  ]
}
```

---

## Environment Variables
- `SHOPIFY_STORE_DOMAIN` (e.g. `yourstore.myshopify.com`)
- `SHOPIFY_ACCESS_TOKEN` (from Shopify admin)

## Notes
- All data is managed in Shopify only. No local database is used.
- Errors from Shopify are logged to the server console for debugging.
- Use `/api/orders` for completed orders and `/api/draft-order` for draft orders.