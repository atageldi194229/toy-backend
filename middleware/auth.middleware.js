const expressAsyncHandler = require("express-async-handler");
const { TokenNotFound } = require("../errors/server_errors");
const JwtService = require("../services/jwt.service");

exports.verifyToken = expressAsyncHandler(async (req, res, next) => {
  let token;

  try {
    token = req.header("Authorization").split(" ")[1];
  } catch (_) {
    throw new TokenNotFound();
  }

  console.log("TOKEN: ", token);

  JwtService.accessToken().verify(token);
  const { payload, header, signature } = JwtService.accessToken().decode(token);

  console.log("PAYLOAD: ", payload);

  req.user = payload.user;
  //   req.user = await User.findOne({ where: { id: payload.userId } });

  return next();
});
