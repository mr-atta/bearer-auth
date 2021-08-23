"use strict";

const base64 = require("base-64");
const { user } = require("../models/index.js");

module.exports = (users) => async (req, res, next) => {
  if (!req.headers.authorization) {
    next("invalid login");
    return;
  }

  // let basic = req.headers.authorization;
  const basic = req.headers.authorization.split(" ").pop();
  console.log(basic);
  let [username, pass] = base64.decode(basic).split(":");
  console.log(username);
  console.log(pass);

  try {
    await users.authenticateBasic(username, pass).then((user) => {
      req.user = user;
      next();
    });
  } catch (e) {
    // res.status(403).send("Invalid Login");
    next("Invalid login" + e);
  }
};
