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

class ShopifyProductOptionService {
  //productOptionsCreate
  // create new product options and values
  static async createProductOptions(productId, options, variantStrategy = null) {
    const gqlMutation = `mutation createOptions($productId: ID!, $options: [OptionCreateInput!]!, $variantStrategy: ProductOptionCreateVariantStrategy) {
      productOptionsCreate(productId: $productId, options: $options, variantStrategy: $variantStrategy) {
        userErrors {
          field
          message
          code
        }
        product {
          id
          variants(first: 10) {
            nodes {
              id
              title
              selectedOptions {
                name
                value
              }
            }
          }
          options {
            id
            name
            values
            position
            optionValues {
              id
              name
              hasVariants
            }
          }
        }
      }
    }`;

    try {
      const variables = { productId, options };
      if (variantStrategy) {
        variables.variantStrategy = variantStrategy;
      }

      const response = await client.query({
        data: {
          query: gqlMutation,
          variables
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productOptionsCreate) {
        console.error('Shopify error (createProductOptions):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productOptionsCreate.userErrors && data.productOptionsCreate.userErrors.length > 0) {
        console.error('Shopify userErrors (createProductOptions):', data.productOptionsCreate.userErrors);
      }
      
      return data.productOptionsCreate;
    } catch (err) {
      console.error('Shopify API error (createProductOptions):', err.response?.data || err.body || err);
      throw err;
    }
  }

  // Delete product options that don't have associated variants
  static async deleteProductOptions(productId, options, strategy = null) {
    const gqlMutation = `mutation deleteOptions($productId: ID!, $options: [ID!]!, $strategy: ProductOptionDeleteStrategy) {
      productOptionsDelete(productId: $productId, options: $options, strategy: $strategy) {
        userErrors {
          field
          message
          code
        }
        deletedOptionsIds
        product {
          id
          options {
            id
            name
            values
            position
            optionValues {
              id
              name
              hasVariants
            }
          }
        }
      }
    }`;

    try {
      const variables = { productId, options };
      if (strategy) {
        variables.strategy = strategy;
      }

      const response = await client.query({
        data: {
          query: gqlMutation,
          variables
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productOptionsDelete) {
        console.error('Shopify error (deleteProductOptions):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productOptionsDelete.userErrors && data.productOptionsDelete.userErrors.length > 0) {
        console.error('Shopify userErrors (deleteProductOptions):', data.productOptionsDelete.userErrors);
      }
      
      return data.productOptionsDelete;
    } catch (err) {
      console.error('Shopify API error (deleteProductOptions):', err.response?.data || err.body || err);
      throw err;
    }
  }

  // Update product options and their values
  static async updateProductOption(
    productId, 
    option, 
    optionValuesToAdd = null, 
    optionValuesToUpdate = null, 
    optionValuesToDelete = null, 
    variantStrategy = null
  ) {
    const gqlMutation = `mutation updateOption(
      $productId: ID!,
      $option: OptionUpdateInput!,
      $optionValuesToAdd: [OptionValueCreateInput!],
      $optionValuesToUpdate: [OptionValueUpdateInput!],
      $optionValuesToDelete: [ID!]
      $variantStrategy: ProductOptionUpdateVariantStrategy
    ) {
      productOptionUpdate(
        productId: $productId,
        option: $option,
        optionValuesToAdd: $optionValuesToAdd,
        optionValuesToUpdate: $optionValuesToUpdate,
        optionValuesToDelete: $optionValuesToDelete,
        variantStrategy: $variantStrategy
      ) {
        userErrors { field message code }
        product {
          id
          options {
            id
            name
            values
            position
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
              selectedOptions { name, value }
            }
          }
        }
      }
    }`;

    try {
      const variables = { productId, option };
      
      if (optionValuesToAdd) {
        variables.optionValuesToAdd = optionValuesToAdd;
      }
      if (optionValuesToUpdate) {
        variables.optionValuesToUpdate = optionValuesToUpdate;
      }
      if (optionValuesToDelete) {
        variables.optionValuesToDelete = optionValuesToDelete;
      }
      if (variantStrategy) {
        variables.variantStrategy = variantStrategy;
      }

      const response = await client.query({
        data: {
          query: gqlMutation,
          variables
        },
      });
      
      const data = response.body.data;
      if (!data || !data.productOptionUpdate) {
        console.error('Shopify error (updateProductOption):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      
      if (data.productOptionUpdate.userErrors && data.productOptionUpdate.userErrors.length > 0) {
        console.error('Shopify userErrors (updateProductOption):', data.productOptionUpdate.userErrors);
      }
      
      return data.productOptionUpdate;
    } catch (err) {
      console.error('Shopify API error (updateProductOption):', err.response?.data || err.body || err);
      throw err;
    }
  }
}

module.exports = ShopifyProductOptionService; 