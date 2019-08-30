const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const SECRET = "dfasdfa324desfdfsfasdf32";

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    // user: req.user,
    req: req,
    res: res,
    SECRET: SECRET
  }),
  introspection: true,
  playground: true
});

server.applyMiddleware({ app });

app.get("/", (req, res, next) => {
  res.redirect("/graphql");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(result => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("server started");
      // Fake Data Generation
      // const movie = new Movie({
      //   scoutbase_rating: 4,
      //   title: "Harry Potter and the Deathly Hallows: Part 2",
      //   year: 2011,
      //   rating: 5,
      //   actors: {
      //     name: "Calph Fiennes",
      //     birthday: "05-02-1985",
      //     country: "UK",
      //     directors: {
      //       name: "David Yates",
      //       birthday: "01-01-1980",
      //       country: "USA"
      //     }
      //   }
      // });
      // return movie.save().then(result => {
      //   console.log(result);
      // });
    });
  })
  .catch(err => console.log(err));
