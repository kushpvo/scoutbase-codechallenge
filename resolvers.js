const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Movie = require("./models/Movie");
const User = require("./models/User");

const resolvers = {
  Query: {
    movies: (_, {}, context) => {
      let user;
      const token =
        context.req.body.token ||
        context.req.query.token ||
        context.req.headers["x-access-token"] ||
        context.req.headers["Authorization"] ||
        context.req.headers["authorization"];
      if (token) {
        const decoded = jwt.verify(token, context.SECRET, (err, decoded) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          } else {
            return decoded;
          }
        });
        user = decoded.user;
      }

      if (user) {
        console.log("user authenticated");
        return Movie.find().then(result => {
          let newResult = result;
          newResult.forEach(i => {
            i.scoutbase_rating = (Math.random() * (9.0 - 5.0) + 5.0).toFixed(1);
          });
          return result;
        });
      } else {
        console.log("not auth");
        return Movie.find().then(result => {
          return result;
        });
      }
    }
  },
  Mutation: {
    createUser: (_, { username, password }, context) => {
      const user = bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
          username: username,
          password: hashedPassword
        });
        const savedUser = user.save().then();
        const token = jwt.sign(
          {
            user: { username: savedUser.username, id: savedUser._id }
          },
          context.SECRET,
          {
            expiresIn: "1d"
          }
        );
        return { token: token, user: { savedUser } };
      });
      return user;
    },
    login: (_, { username, password }, context) => {
      const user = User.findOne({ username: username })
        .then(user => {
          if (!user) {
            throw new Error("No user found");
          }

          const token = bcrypt.compare(password, user.password).then(valid => {
            if (!valid) {
              throw new Error("Incorrect password");
            }

            const token = jwt.sign(
              {
                user: { username: user.username, id: user._id }
              },
              context.SECRET,
              {
                expiresIn: "1d"
              }
            );
            return token;
          });
          return {
            token: token,
            user: { username: user.username, id: user._id }
          };
        })
        .catch(err => {
          console.log(err);
        });
      return user;
    }
  }
};

module.exports = resolvers;
