"use strict";

require("dotenv").config();
// db require
const { Sequelize, DataTypes } = require("sequelize");
// db require Schema
const userSchema = require("./users.js");

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres@localhost:5432/lab07";

/////////////////////////

process.env.NODE_ENV === "test" ? "sqlite:memory:" : process.env.DATABASE_URL;

const DATABASE_CONFIG =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: true,
          rejectUnauthorized: false,
        },
      }
    : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

/////////////////////

// const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  db: sequelize,
  users: userSchema(sequelize, DataTypes),
};
