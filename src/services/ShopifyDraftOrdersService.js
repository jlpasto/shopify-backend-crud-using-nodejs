require('@shopify/shopify-api/adapters/node');

const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || 'dummy',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || 'dummy',
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

class ShopifyDraftOrdersService {
  static async getAllDraftOrders({ first = 10 }) {
    const gqlQuery = `query DraftOrders {
      draftOrders(first: ${first}) {
        edges {
          node {
            id
            note2
            email
            taxesIncluded
            currencyCode
            invoiceSentAt
            createdAt
            updatedAt
            taxExempt
            completedAt
            name
            status
            lineItems(first: 10) {
              edges {
                node {
                  id
                  variant { id title }
                  product { id }
                  name
                  sku
                  vendor
                  quantity
                  requiresShipping
                  taxable
                  isGiftCard
                  fulfillmentService { type }
                  weight { unit value }
                  taxLines {
                    title
                    source
                    rate
                    ratePercentage
                    priceSet {
                      presentmentMoney { amount currencyCode }
                      shopMoney { amount currencyCode }
                    }
                  }
                  appliedDiscount {
                    title
                    value
                    valueType
                  }
                  name
                  custom
                  id
                }
              }
            }
            shippingAddress {
              firstName address1 phone city zip province country lastName address2 company latitude longitude name country countryCodeV2 provinceCode
            }
            billingAddress {
              firstName address1 phone city zip province country lastName address2 company latitude longitude name country countryCodeV2 provinceCode
            }
            invoiceUrl
            appliedDiscount { title value valueType }
            order {
              id
              customAttributes { key value }
            }
            shippingLine {
              id title carrierIdentifier custom code deliveryCategory source discountedPriceSet {
                presentmentMoney { amount currencyCode }
                shopMoney { amount currencyCode }
              }
            }
            taxLines {
              channelLiable priceSet {
                presentmentMoney { amount currencyCode }
                shopMoney { amount currencyCode }
              }
              rate ratePercentage source title
            }
            tags
            totalPrice
            subtotalPrice
            totalTax
            customer {
              id email smsMarketingConsent { consentCollectedFrom consentUpdatedAt marketingOptInLevel marketingState } emailMarketingConsent { consentUpdatedAt marketingOptInLevel marketingState } createdAt updatedAt firstName lastName state amountSpent { amount currencyCode } lastOrder { id name currencyCode } note verifiedEmail multipassIdentifier taxExempt tags phone taxExemptions defaultAddress { id firstName lastName company address1 address2 city province country zip phone name provinceCode countryCodeV2 }
            }
          }
        }
      }
    }`;
    try {
      const response = await client.query({
        data: gqlQuery,
      });
      const data = response.body.data;
      if (!data || !data.draftOrders) {
        console.error('Shopify error (getAllDraftOrders):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.draftOrders;
    } catch (err) {
      console.error('Shopify API error (getAllDraftOrders):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async createDraftOrder(input) {
    const gqlMutation = `mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
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
      if (!data || !data.draftOrderCreate) {
        console.error('Shopify error (createDraftOrder):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      return data.draftOrderCreate;
    } catch (err) {
      console.error('Shopify API error (createDraftOrder):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async updateDraftOrder(id, input) {
    const gqlMutation = `
      mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
        draftOrderUpdate(id: $id, input: $input) {
          draftOrder {
            id
            note2
            email
            taxesIncluded
            currencyCode
            invoiceSentAt
            createdAt
            updatedAt
            taxExempt
            completedAt
            name
            status
            marketRegionCountryCode
            presentmentCurrencyCode
            shippingAddress {
              firstName
              address1
              phone
              city
              zip
              province
              country
              lastName
              address2
              company
              latitude
              longitude
              name
              country
              countryCodeV2
              provinceCode
            }
            billingAddress {
              firstName
              address1
              phone
              city
              zip
              province
              country
              lastName
              address2
              company
              latitude
              longitude
              name
              country
              countryCodeV2
              provinceCode
            }
            invoiceUrl
            appliedDiscount {
              title
              value
              valueType
            }
            order {
              id
              customAttributes {
                key
                value
              }
            }
            shippingLine {
              id
              title
              carrierIdentifier
              custom
              code
              deliveryCategory
              source
              discountedPriceSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
            taxLines {
              channelLiable
              priceSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
                shopMoney {
                  amount
                  currencyCode
                }
              }
              rate
              ratePercentage
              source
              title
            }
            tags
            customer {
              id
              email
              smsMarketingConsent {
                consentCollectedFrom
                consentUpdatedAt
                marketingOptInLevel
                marketingState
              }
              emailMarketingConsent {
                consentUpdatedAt
                marketingOptInLevel
                marketingState
              }
              createdAt
              updatedAt
              firstName
              lastName
              state
              amountSpent {
                amount
                currencyCode
              }
              lastOrder {
                id
                name
                currencyCode
              }
              note
              verifiedEmail
              multipassIdentifier
              taxExempt
              tags
              phone
              taxExemptions
              defaultAddress {
                id
                firstName
                lastName
                company
                address1
                address2
                city
                province
                country
                zip
                phone
                name
                provinceCode
                countryCodeV2
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    try {
      const response = await client.query({
        data: {
          query: gqlMutation,
          variables: { id, input },
        },
      });
      const data = response.body.data;
      if (!data || !data.draftOrderUpdate) {
        console.error('Shopify error (updateDraftOrder):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      if (data.draftOrderUpdate.userErrors && data.draftOrderUpdate.userErrors.length > 0) {
        console.error('Shopify userErrors (updateDraftOrder):', data.draftOrderUpdate.userErrors);
      }
      return data.draftOrderUpdate;
    } catch (err) {
      console.error('Shopify API error (updateDraftOrder):', err.response?.data || err.body || err);
      throw err;
    }
  }

  static async deleteDraftOrder(id) {
    const gqlMutation = `mutation draftOrderDelete($input: DraftOrderDeleteInput!) {
      draftOrderDelete(input: $input) {
        deletedId
        userErrors { field message }
      }
    }`;
    try {
      const response = await client.query({
        data: {
          query: gqlMutation,
          variables: { input: { id } },
        },
      });
      const data = response.body.data;
      if (!data || !data.draftOrderDelete) {
        console.error('Shopify error (deleteDraftOrder):', response.body);
        return { userErrors: [{ message: 'Shopify error', details: response.body }] };
      }
      if (data.draftOrderDelete.userErrors && data.draftOrderDelete.userErrors.length > 0) {
        console.error('Shopify userErrors (deleteDraftOrder):', data.draftOrderDelete.userErrors);
      }
      return data.draftOrderDelete;
    } catch (err) {
      console.error('Shopify API error (deleteDraftOrder):', err.response?.data || err.body || err);
      throw err;
    }
  }
}

module.exports = ShopifyDraftOrdersService; 