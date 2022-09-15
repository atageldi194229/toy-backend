"use strict";

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { TokenDecodeError, TokenExpired } = require("../errors/server_errors");
const { certificates } = require("../config/config");

class JwtToken {
  constructor({ publicKey, privateKey }, options) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.options = options;
  }

  verify(token) {
    try {
      return jwt.verify(token, this.publicKey, this.options);
    } catch (_) {
      throw new TokenExpired();
    }
  }

  sign(payload) {
    return jwt.sign(payload, this.privateKey, this.options);
  }

  decode(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (_) {
      throw new TokenDecodeError();
    }
  }
}

class RefreshToken extends JwtToken {
  constructor() {
    const options = {
      expiresIn: process.env.JWT_EXPIRE || "1d",
      algorithm: process.env.JWT_ALGORITHM || "RS256",
    };

    super(certificates[0], options);
  }
}

class AccessToken extends JwtToken {
  constructor() {
    const options = {
      expiresIn: process.env.JWT_EXPIRE || "2h",
      algorithm: process.env.JWT_ALGORITHM || "RS256",
    };

    super(certificates[1], options);
  }
}

const _accessToken = new AccessToken();
const _refreshToken = new RefreshToken();

exports.accessToken = () => _accessToken;
exports.refreshToken = () => _refreshToken;

/**
 * To sign refresh token
 * @param {*} payload
 * @returns
 */
exports.signRefreshToken = (payload) => {
  return jwt.sign(payload, certificates[0].privateKey, refreshTokenOptions);
};

/**
 * To sign access token
 * @param {*} payload
 * @returns
 */
exports.signAccessToken = (payload) => {
  return jwt.sign(payload, certificates[1].privateKey, accessTokenOptions);
};

exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, certificates[0].publicKey, refreshTokenOptions);
  } catch (error) {
    throw new TokenExpired();
  }
};

exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, certificates[1].publicKey, accessTokenOptions);
  } catch (error) {
    throw new TokenExpired();
  }
};

/**
 * Get payload of token
 * @param {string} token
 * @returns {Object} token payload
 */
exports.decode = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (_) {
    throw new TokenDecodeError();
  }
};
