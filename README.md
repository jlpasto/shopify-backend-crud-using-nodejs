# Shopify Product CRUD Backend

## API Endpoints

All endpoints interact directly with your Shopify store. You must have your Shopify access token and store domain set in your `.env` file.

---

## Sample Commands

### Create Product

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

---

### Get All Products

**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/products
```

**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/products
```

---

### Get Product by ID

**Windows (PowerShell):**
```powershell
curl http://localhost:3000/api/products/<PRODUCT_ID>
```

**Linux/macOS (bash):**
```bash
curl http://localhost:3000/api/products/<PRODUCT_ID>
```

---

### Update Product

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

---

### Delete Product

**Windows (PowerShell):**
```powershell
curl -Method DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```

**Linux/macOS (bash):**
```bash
curl -X DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```

---

## Environment Variables
- `SHOPIFY_STORE_DOMAIN` (e.g. `yourstore.myshopify.com`)
- `SHOPIFY_ACCESS_TOKEN` (from Shopify admin)

## Notes
- All data is managed in Shopify only. No local database is used.
- Errors from Shopify are logged to the server console for debugging.