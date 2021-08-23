"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "super";

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },

    password: { type: DataTypes.STRING, allowNull: false },

    token: {
      type: DataTypes.VIRTUAL,
      // allowNull: false, // no need

      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },

      set(tokenOb) {
        return jwt.sign(tokenOb, SECRET);
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10); // async   await
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password)
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    console.log(token);
    console.log(jwt.decode(token));

    try {
      const parsedToken = jwt.verify(token, process.env.SECRET || SECRET);
      const user = await this.findOne({
        where: { username: parsedToken.username },
      });

      if (user) {
        return user;
      }

      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userSchema;
