"use strict";

module.exports = (sequelize, DataTypes) => {
  let AuthToken = sequelize.define(
    "AuthToken",
    {
      refreshToken: DataTypes.STRING,
      requestHeaders: DataTypes.JSON,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  AuthToken.associate = function (models) {
    // associations there
    AuthToken.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  return AuthToken;
};
