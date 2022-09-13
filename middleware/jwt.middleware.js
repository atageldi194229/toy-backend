const { Unauthorized } = require("../errors/server_errors");
const JwtService = require("../services/jwt.service");

/**
 * Verify JWT token
 * @function verify middleware
 */
exports.verify = (req, res, next) => {
  const bearer = req.header("Authorization") || "";
  const token = bearer.split(" ")[1];
  const valid = JwtService.verify(token);
  return valid ? next() : next(new Unauthorized());
};
