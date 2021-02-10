const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { validationResult } = require("express-validator");

exports.createUser = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        const error = new Error("username sudah ada");
        error.statusCode = 401;
        throw error;
      }
      bcrypt.hash(password, 12).then((hashedPass) => {
        const user = new User({
          password: hashedPass,
          username: username,
        });
        loadedUser = user;
        user.save((err, doc) => {
          if (err) {
            throw new Error("register failed");
          }
          const accesToken = jwt.sign(
            {
              username: doc.username,
              userId: doc._id.toString(),
            },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
          );

          res.status(200).json({
            token: accesToken,
            username: doc.username,
            role: doc.role,
          });
        });
      });
    })

    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  let loadedUser = null;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        throw new Error("username is invalid");
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const accesToken = jwt.sign(
        {
          username: loadedUser.username,
          userId: loadedUser._id.toString(),
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        accesToken,
      });
      console.log("login succes");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
