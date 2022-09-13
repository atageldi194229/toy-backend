"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // username: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: true,
      //   validate: {
      //     min: 3,
      //   },
      // },
      email: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            msg: "Incorrect phone number.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  User.associate = function (models) {
    // associations there
    User.hasMany(models.AuthToken, { as: "authTokens", foreignKey: "userId" });
  };

  return User;
};
