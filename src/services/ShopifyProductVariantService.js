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

class ShopifyProductVariantService {
  static async getProductVariantById(id) {
    const gqlQuery = `query GetProductVariant($id: ID!) {
      productVariant(id: $id) {
        id
        title
        availableForSale
        barcode
        compareAtPrice
        createdAt
      }
    }`;

    try {
      const response = await client.query({
        data: {
          query: gqlQuery,
          variables: { id }
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productVariant) {
        console.error('Shopify error (getProductVariantById):', response.body);
        return { userErrors: [{ message: 'Product variant not found', details: response.body }] };
      }
      
      if (data.productVariant.userErrors && data.productVariant.userErrors.length > 0) {
        console.error('Shopify userErrors (getProductVariantById):', data.productVariant.userErrors);
        return { userErrors: data.productVariant.userErrors };
      }
      
      return data.productVariant;
    } catch (err) {
      console.error('Shopify API error (getProductVariantById):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getProductVariantsByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('ids must be a non-empty array of Shopify ProductVariant GIDs');
    }

    // Build the GraphQL query with aliases for each variant
    const gqlQuery = `query {
      ${ids.map((id, idx) => `
        productVariant${idx + 1}: productVariant(id: "${id}") {
          id
          title
          availableForSale
          barcode
          compareAtPrice
          createdAt
        }
      `).join('\n')}
    }`;

    try {
      const response = await client.query({
        data: gqlQuery,
      });
      
      const data = response.body.data;
      if (!data) {
        console.error('Shopify error (getProductVariantsByIds):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      // Return an array of variants in the same order as the input IDs
      const variants = ids.map((_, idx) => data[`productVariant${idx + 1}`]);
      return variants;
    } catch (err) {
      console.error('Shopify API error (getProductVariantsByIds):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getProductVariantsByProductId(productId, { first = 10, after } = {}) {
    const gqlQuery = `query ProductVariantsList($first: Int!, $after: String) {
      productVariants(first: $first, after: $after, query: "product_id:${productId}") {
        nodes {
          id
          title
          availableForSale
          barcode
          compareAtPrice
          createdAt
        }
        pageInfo {
          startCursor
          endCursor
        }
      }
    }`;

    try {
      const response = await client.query({
        data: {
          query: gqlQuery,
          variables: { first, after }
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productVariants) {
        console.error('Shopify error (getProductVariantsByProductId):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      return data.productVariants;
    } catch (err) {
      console.error('Shopify API error (getProductVariantsByProductId):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async createProductVariant(productId, variants) {
    const gqlMutation = `mutation ProductVariantsCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants {
          id
          title
          selectedOptions {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }`;

    try {
      const response = await client.query({
        data: {
          query: gqlMutation,
          variables: { productId, variants }
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productVariantsBulkCreate) {
        console.error('Shopify error (createProductVariant):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productVariantsBulkCreate.userErrors && data.productVariantsBulkCreate.userErrors.length > 0) {
        console.error('Shopify userErrors (createProductVariant):', data.productVariantsBulkCreate.userErrors);
      }
      
      return data.productVariantsBulkCreate;
    } catch (err) {
      console.error('Shopify API error (createProductVariant):', err.response?.data || err.body || err);
      throw err;
    }
  }
}

module.exports = ShopifyProductVariantService;
