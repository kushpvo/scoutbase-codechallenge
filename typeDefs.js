const { gql } = require("apollo-server-express");
const User = require("./models/User");

const typeDefs = gql`
  type Query {
    movies: [Movie!]!
  }

  type Directors {
    id: ID
    name: String!
    birthday: String!
    country: String!
  }

  type Actors {
    id: ID
    name: String!
    birthday: String!
    country: String!
    directors: Directors!
  }

  type Movie {
    id: ID
    scoutbase_rating: Float
    title: String!
    year: Int!
    rating: Int!
    actors: Actors!
  }

  type User {
    id: ID
    username: String
  }

  type UserData {
    token: String
    user: User
  }

  type Mutation {
    createUser(username: String, password: String): UserData
    login(username: String, password: String): UserData
  }
`;

module.exports = typeDefs;
