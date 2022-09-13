"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";

// Load env vars
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const customConfigPath = path.join(__dirname, "../config/config.json");
let config = {};
if (fs.existsSync(customConfigPath)) {
  config = require(customConfigPath);
}

// const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize = new Sequelize(
  config.database || process.env.DB_NAME,
  config.username || process.env.DB_USER,
  config.password || process.env.DB_PASS,
  {
    host: config.host || process.env.DB_HOST,
    dialect: "postgres",
    // logging: false,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;
exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
exports.User = db.User;
exports.AuthToken = db.AuthToken;
