const express = require("express");
const router = express.Router();
const authControl = require("../controller/auth");
const { check, body } = require("express-validator");

router.post(
  "/signup",
  [
    check("password")
      .isLength({ min: 6 })
      .withMessage("Please enter password at least 6 character long")
      .trim(),
  ],
  authControl.createUser
);

router.post(
  "/login",
  [body("password").trim(), body("username").trim()],
  authControl.login
);

module.exports = router;
