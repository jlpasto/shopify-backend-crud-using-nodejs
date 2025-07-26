require('@shopify/shopify-api/adapters/node');

const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'dummy',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'dummy',
  scopes: ['read_products', 'write_products'],
  hostName: SHOPIFY_STORE_DOMAIN,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

const session = {
  shop: SHOPIFY_STORE_DOMAIN,
  accessToken: SHOPIFY_ACCESS_TOKEN,
};

const client = new shopify.clients.Graphql({ session });

class ShopifyService {
  static async getAllProducts({ limit = 10 }) {
    try {
      const gqlQuery = `query GetProducts {
        products(first: ${limit}) {
          nodes {
            id
            title
          }
        }
      }`;

      const response = await client.query({
        data: gqlQuery,
      });
      
      const data = response.body.data;
      if (!data || !data.products) {
        console.error('Shopify error (getAllProducts):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      return {
        products: data.products.nodes,
        totalCount: data.products.nodes.length
      };
    } catch (err) {
      console.error('Shopify API error (getAllProducts):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getProductById(id) {
    try {
      // Convert numeric ID to GID if needed
      const gid = id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
      
      const gqlQuery = `query GetProduct($id: ID!) {
        product(id: $id) {
          id
          title
          variants(first: 10) {
            nodes {
              id
              title
            }
          }
          collections(first: 10) {
            nodes {
              id
              title
            }
          }
        }
      }`;

      const response = await client.query({
        data: {
          query: gqlQuery,
          variables: { id: gid }
        },
      });
      
      const data = response.body.data;
      if (!data || !data.product) {
        console.error('Shopify error (getProductById):', response.body);
        return { userErrors: [{ message: 'Product not found', details: response.body }] };
      }
      
      return data.product;
    } catch (err) {
      console.error('Shopify API error (getProductById):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async createProduct(product) {
    try {
      // Build productOptions string manually for GraphQL
      let productOptionsString = '';
      if (product.productOptions && product.productOptions.length > 0) {
        const optionsArray = product.productOptions.map(option => {
          const valuesString = option.values.map(value => `{name: "${value.name}"}`).join(', ');
          return `{name: "${option.name}", values: [${valuesString}]}`;
        });
        productOptionsString = `, productOptions: [${optionsArray.join(', ')}]`;
      }

      const gqlMutation = `mutation {
        productCreate(product: {title: "${product.title}"${productOptionsString}}) {
          userErrors {
            field
            message
          }
          product {
            id
            title
            options {
              id
              name
              position
              values
              optionValues {
                id
                name
                hasVariants
              }
            }
            variants(first: 5) {
              nodes {
                id
                title
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }`;

      const response = await client.query({
        data: gqlMutation,
      });
      
      const data = response.body.data;
      if (!data || !data.productCreate) {
        console.error('Shopify error (createProduct):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productCreate.userErrors && data.productCreate.userErrors.length > 0) {
        console.error('Shopify userErrors (createProduct):', data.productCreate.userErrors);
      }
      
      return data.productCreate;
    } catch (err) {
      console.error('Shopify API error (createProduct):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async updateProduct(shopifyProductId, product) {
    try {
      // Convert numeric ID to GID if needed
      const gid = shopifyProductId.startsWith('gid://') ? shopifyProductId : `gid://shopify/Product/${shopifyProductId}`;
      
      const gqlMutation = `mutation UpdateProductComprehensive($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          userErrors {
            field
            message
          }
          product {
            id
            title
            handle
            vendor
            productType
            status
            tags
            seo {
              title
              description
            }
          }
        }
      }`;

      const productInput = {
        id: gid,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        status: product.status || 'ACTIVE',
        tags: product.tags || [],
        seo: product.seo ? {
          title: product.seo.title,
          description: product.seo.description
        } : undefined
      };

      const response = await client.query({
        data: {
          query: gqlMutation,
          variables: { product: productInput }
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productUpdate) {
        console.error('Shopify error (updateProduct):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productUpdate.userErrors && data.productUpdate.userErrors.length > 0) {
        console.error('Shopify userErrors (updateProduct):', data.productUpdate.userErrors);
      }
      
      return data.productUpdate;
    } catch (err) {
      console.error('Shopify API error (updateProduct):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async deleteProduct(shopifyProductId) {
    try {
      // Convert numeric ID to GID if needed
      const gid = shopifyProductId.startsWith('gid://') ? shopifyProductId : `gid://shopify/Product/${shopifyProductId}`;
      
      const gqlMutation = `mutation {
        productDelete(input: {id: "${gid}"}) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }`;

      const response = await client.query({
        data: gqlMutation,
      });
      
      const data = response.body.data;
      if (!data || !data.productDelete) {
        console.error('Shopify error (deleteProduct):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productDelete.userErrors && data.productDelete.userErrors.length > 0) {
        console.error('Shopify userErrors (deleteProduct):', data.productDelete.userErrors);
      }
      
      return data.productDelete;
    } catch (err) {
      console.error('Shopify API error (deleteProduct):', err.response?.data || err.body || err);
      throw err;
    }
  }
}

module.exports = ShopifyService; 