const productResolvers = require('./productResolvers');

const resolvers = {
  Query: {
    ...productResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
  },
};

module.exports = resolvers;