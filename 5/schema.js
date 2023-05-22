
type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: Category!
}

type Category {
    id: ID!
    name: String!
    products: [Product!]!
}

type User {
    id: ID!
    name: String!
    email: String!
    orders: [Order!]!
}

type Order {
    id: ID!
    user: User!
    products: [Product!]!
    total: Float!
    createdAt: String!
}

type Query {
    getProduct(id: ID!): Product
    getProducts: [Product!]!
    getCategory(id: ID!): Category
    getCategories: [Category!]!
    getUser(id: ID!): User
    getOrder(id: ID!): Order
    getUserOrders(userId: ID!): [Order!]!
}

type Mutation {
    createUser(name: String!, email: String!): User!
    createOrder(userId: ID!, productIds: [ID!]!): Order!
}

schema {
    query: Query
    mutation: Mutation
}
