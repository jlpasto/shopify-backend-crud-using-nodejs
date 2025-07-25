require('@shopify/shopify-api/adapters/node');

const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'dummy', // not used for private apps
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'dummy', // not used for private apps
  scopes: ['read_orders', 'write_orders'],
  hostName: SHOPIFY_STORE_DOMAIN,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

const session = {
  shop: SHOPIFY_STORE_DOMAIN,
  accessToken: SHOPIFY_ACCESS_TOKEN,
};

const client = new shopify.clients.Graphql({ session });

class ShopifyOrderService {
  static async getAllOrders({ first = 10 } = {}) {
    const gqlQuery = `query {
      orders(first: ${first}) {
        edges {
          cursor
          node {
            id
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`;
    try {
      const response = await client.query({
        data: gqlQuery,
      });
      const data = response.body.data;
      if (!data || !data.orders) {
        console.error('Shopify error (orders):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.orders;
    } catch (err) {
      console.error('Shopify API error (orders):', err.response?.data || err.body || err);
      throw err;
    }
  }
  // Retrieve a list of orders using their IDs and GraphQL aliases
  static async getOrdersByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('ids must be a non-empty array of Shopify Order GIDs');
    }

    // Build the GraphQL query with aliases for each order
    const gqlQuery = `query {
      ${ids.map((id, idx) => `
        order${idx + 1}: order(id: "${id}") {
          id
          name
          email
          createdAt
          totalPriceSet { shopMoney { amount currencyCode } }
          displayFinancialStatus
          displayFulfillmentStatus
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                originalUnitPriceSet { shopMoney { amount currencyCode } }
              }
            }
          }
        }
      `).join('\n')}
    }`;

    try {
      const response = await client.query({
        data: gqlQuery,
      });
      const data = response.body.data;
      if (!data) {
        console.error('Shopify error (getOrdersByIds):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      // Return an array of orders in the same order as the input IDs
      const orders = ids.map((_, idx) => data[`order${idx + 1}`]);
      return orders;
    } catch (err) {
      console.error('Shopify API error (getOrdersByIds):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getOrderNodeById(id) {
    const gqlQuery = `query GetOrderNode($id: ID!) {
      node(id: $id) {
        id
        ... on Order {
          name
        }
      }
    }`;
    try {
      const response = await client.query({
        data: {
          query: gqlQuery,
          variables: { id },
        },
      });
      const data = response.body.data;
      if (!data || !data.node) {
        console.error('Shopify error (getOrderNodeById):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.node;
    } catch (err) {
      console.error('Shopify API error (getOrderNodeById):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getOrderMetafields(ownerId) {
    const gqlQuery = `query OrderMetafields($ownerId: ID!) {
      order(id: $ownerId) {
        metafields(first: 3) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }`;
    try {
      const response = await client.query({
        data: {
          query: gqlQuery,
          variables: { ownerId },
        },
      });
      const data = response.body.data;
      if (!data || !data.order) {
        console.error('Shopify error (getOrderMetafields):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.order.metafields;
    } catch (err) {
      console.error('Shopify API error (getOrderMetafields):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async getOrderDetailsById(id) {
    const gqlQuery = `
      query {
        order(id: "${id}") {
          id
          name
          totalPriceSet {
            presentmentMoney {
              amount
            }
          }
          lineItems(first: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
    `;
    try {
      const response = await client.query({
        data: gqlQuery,
      });
      const data = response.body.data;
      if (!data || !data.order) {
        console.error('Shopify error (getOrderDetailsById):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.order;
    } catch (err) {
      console.error('Shopify API error (getOrderDetailsById):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async deleteOrder(orderId) {
    const gqlMutation = `mutation OrderDelete($orderId: ID!) {
      orderDelete(orderId: $orderId) {
        deletedId
        userErrors {
          field
          message
          code
        }
      }
    }`;
    try {
      const response = await client.query({
        data: {
          query: gqlMutation,
          variables: { orderId },
        },
      });
      const data = response.body.data;
      if (!data || !data.orderDelete) {
        console.error('Shopify error (deleteOrder):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      if (data.orderDelete.userErrors && data.orderDelete.userErrors.length > 0) {
        console.error('Shopify userErrors (deleteOrder):', data.orderDelete.userErrors);
      }
      return data.orderDelete;
    } catch (err) {
      console.error('Shopify API error (deleteOrder):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async updateOrder(input) {
    const gqlMutation = `mutation OrderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          note
          shippingAddress {
            address1
            city
            province
            zip
            country
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
          variables: { input },
        },
      });
      const data = response.body.data;
      if (!data || !data.orderUpdate) {
        console.error('Shopify error (updateOrder):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      if (data.orderUpdate.userErrors && data.orderUpdate.userErrors.length > 0) {
        console.error('Shopify userErrors (updateOrder):', data.orderUpdate.userErrors);
      }
      return data.orderUpdate;
    } catch (err) {
      console.error('Shopify API error (updateOrder):', err.response?.data || err.body || err);
      throw err;
    }
  }
}
module.exports = ShopifyOrderService; 