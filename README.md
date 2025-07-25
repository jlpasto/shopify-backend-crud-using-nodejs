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

#### Create Product
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

#### Update Product
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

#### Delete Product
```powershell
curl -Method DELETE http://localhost:3000/api/products/<PRODUCT_ID>
```

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