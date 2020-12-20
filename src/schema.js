import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `
    type Profile {
        _id: Int!
        name: String!
        active: Boolean!
    }

    type City {
        _id: Int!
        name: String!
        active: Boolean!
    }

    type Customer {
        _id: Int!
        profile: Profile
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        birthday: String!
        active: Boolean!
    }

    type Address {
        _id: Int!
        customer: Customer
        city: City
        address: String!
    }

    type Category {
        _id: Int!
        name: String!
        active: Boolean!
    }

    type Product {
        _id: Int!
        category: Category
        name: String!
        price: Int!
        quantity: Int!
    }

    type Cart {
        _id: Int!
        customer: Customer
        address: Address
        date: String!
    }

    type CartDetail {
        _id: ID
        cart: Cart
        product: Product
        quantity: Int!
    }

    type Order {
        _id: Int!
        cart: Cart
        address: Address
        date: String!
        total: Int!
    }

    type OrderDetail {
        _id: ID
        order: Order
        product: Product
        quantity: Int!
    }

    type Query {
        addresses: [Address]
        categories: [Category]
        cities: [City]
        customers: [Customer]
        products: [Product]
        profiles: [Profile]
        carts: [Cart]
        cartsDetail: [CartDetail]
        orders: [Order]
        ordersDetail: [OrderDetail]
    }

    type Mutation {
        bulkInsertCategory: [Category]
        bulkInsertProduct: [Product]
        bulkInsertCity: [City]
        bulkInsertProfile: [Profile]
        bulkInsertCostumer: [Customer]
        bulkInsertAddress: [Address]
        bulkInsertCart: [Cart]
        deleteCarts: [Cart]
        bulkInsertCartDetail: [CartDetail]
        deleteCartsDetail: [CartDetail]
        bulkInsertOrder: [Order]
        deleteOrders: [Order]
        bulkInsertOrderDetail: [OrderDetail]
        deleteOrdersDetail: [OrderDetail]
    }
`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
})