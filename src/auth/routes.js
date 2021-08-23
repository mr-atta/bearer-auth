"use strict";

const express = require("express");
const authRouter = express.Router();

const { users } = require("./models/index.js");
const basicAuth = require("./middleware/basic.js");
const bearerAuth = require("./middleware/bearer.js");

// signup
authRouter.post("/signup", async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    // console.log(userRecord);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    // res.status(200).json(output);
    // console.log("output>>>>>>>>>>" + output);
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
    // res.status(400).send(e);
  }
});

//signin
authRouter.post("/signin", basicAuth(users), (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(req.user);
});

//users
authRouter.get("/users", bearerAuth, async (req, res, next) => {
  const user = await users.findAll({});
  const list = user.map((user) => user.username);

  res.status(200).json(list);
  // res.status(200).json(req.user);
});

//secret
authRouter.get("/secret", bearerAuth, async (req, res, next) => {
  await res.status(200).send("Welcome to the secret area!");
});

module.exports = authRouter;
