"use strict";

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const options = {
  expiresIn: process.env.JWT_EXPIRE || "2h",
  algorithm: process.env.JWT_ALGORITHM || "RS256",
};

const privateKey = fs
  .readFileSync(path.join(__dirname, "../config/private.key"), "utf8")
  .replace(/\\n/gm, "\n");
const publicKey = fs
  .readFileSync(path.join(__dirname, "../config/public.key"), "utf8")
  .replace(/\\n/gm, "\n");

// const privateKey = process.env.JWT_SECRET;
// const publicKey = process.env.JWT_SECRET;

/**
 * Get signed token
 * @param {Object} payload
 * @returns {string} jwt signed token
 */
exports.sign = (payload) => {
  return jwt.sign(payload, privateKey, options);
};

/**
 * Verify token for expire
 * @param {string} token
 * @returns {boolean} true if not expired, otherwise false
 */
exports.verify = (token) => {
  try {
    return jwt.verify(token, publicKey, options);
  } catch (error) {
    return false;
  }
};

/**
 * Get payload of token
 * @param {string} token
 * @returns {Object} token payload
 */
exports.decode = (token) => {
  return jwt.decode(token, { complete: true });
};

/**
 * First verify token for expire then get payload
 * @param {string} token
 * @returns {Object | boolean} token payload
 */
exports.verifyAndDecode = (token) => {
  if (exports.verify(token)) {
    try {
      const { payload } = exports.decode(token);
      return payload;
    } catch (err) {}
  }
  return false;
};
