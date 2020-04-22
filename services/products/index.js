const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
    someProp: ISomeProp
  }

  type ChildProp {
    value: String
  }

  interface ISomeProp {
    childProp: ChildProp
  }

  type SomeProp_IMPL_1 implements ISomeProp {
    childProp: ChildProp
    IAM_IMPL_1: Boolean
  }

  type SomeProp_IMPL_2 implements ISomeProp {
    childProp: ChildProp
    IAM_IMPL_2: Boolean
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const someProp = {
  __typename: "SomeProp_IMPL_2",
  IAM_IMPL_2: true,
  childProp: {
    __typename: "ChildProp",
    value: "childProp value",
  }
}

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
    someProp
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
    someProp
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
    someProp
  }
];
