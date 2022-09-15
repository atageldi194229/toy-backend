const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { User, AuthToken } = require("../../models");
const JwtService = require("../../services/jwt.service");

const {
  UserNotFound,
  IncorrectPasswordError,
  TokenNotFound,
  UserNotVerified,
  UserExists,
} = require("../../errors/server_errors");

/**
 * hash password to save in db
 * @param {string} password user password
 * @returns {string} hashed password
 */
const hashPassword = (password) => {
  // let's hash password with bcryptjs
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

/**
 * Create token PAYLOAD
 * @param {User} user
 * @returns {Object} payload
 */
const createTokenPayload = (user) => {
  return {
    user: {
      id: user.id,
      isVerified: user.isVerified,
    },
  };
};

/**
 * Login then return TOKENS
 * Creates new refresh token
 * @param {User} user
 * @param {RequestHandler} req
 * @returns {Object}
 */
const loginAndGetResponse = async (user, req) => {
  const refreshToken = JwtService.refreshToken().sign(
    createTokenPayload(user),
    "24h"
  );

  await user.createAuthToken({
    refreshToken,
    requestHeaders: req.headers,
  });

  const accessToken = JwtService.accessToken().sign(createTokenPayload(user));

  return {
    refreshToken,
    accessToken,
  };
};

exports.register = expressAsyncHandler(async (req, res) => {
  // throw new UnimplementedError();

  let { phoneNumber, password } = req.body;

  let exists = await User.findOne({
    where: { phoneNumber },
  });

  if (exists) throw new UserExists();

  let user = await User.create({
    phoneNumber,
    password: hashPassword(password),
  });

  res.status(200).json(await loginAndGetResponse(user, req));
});

exports.login = expressAsyncHandler(async (req, res) => {
  // throw new UnimplementedError();

  let { phoneNumber, password } = req.body;

  let user = await User.findOne({
    where: { phoneNumber },
  });

  if (!user) throw new UserNotFound();

  if (!bcrypt.compareSync(password, user.password)) {
    throw new IncorrectPasswordError();
  }

  if (!user.isVerified) throw new UserNotVerified();

  res.status(200).json(await loginAndGetResponse(user, req));
});

exports.refreshToken = expressAsyncHandler(async (req, res) => {
  // throw new UnimplementedError();

  const { refreshToken } = req.body;

  const auth = await AuthToken.findOne({
    where: { refreshToken },
    attributes: { exclude: ["requestHeaders"] },
  });

  if (!auth) throw new TokenNotFound();

  // get user
  const user = await auth.getUser();

  // delete old refresh token
  await auth.destroy();

  // check token for expire time
  JwtService.refreshToken().verify(refreshToken);

  res.status(200).json(await loginAndGetResponse(user, req));
});

exports.changePassword = expressAsyncHandler(async (req, res) => {
  // throw new UnimplementedError();

  let { phoneNumber, password, oldPassword } = req.body;

  let user = await User.findOne({
    where: { phoneNumber },
  });

  if (!user) throw new UserNotFound();

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new IncorrectPasswordError();
  }

  if (!user.isVerified) throw new UserNotVerified();

  await user.update({ password: hashPassword(password) });

  res.status(200).json({ success: true });
});

exports.userExists = expressAsyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  let phoneNumberCount = await User.count({
    where: { phoneNumber },
  });

  res.status(200).json({
    exists: {
      phoneNumber: !(phoneNumberCount === 0),
    },
  });
});

exports.verifyUser = expressAsyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  let user = await User.update(
    { isVerified: true },
    {
      where: { phoneNumber },
    }
  );

  res.status(200).json({ success: true });
});

exports.getAuthTokens = expressAsyncHandler(async (req, res) => {
  const { user } = req;

  const result = await AuthToken.findAndCountAll({
    where: { userId: user.id },
  });

  res.status(200).json(result);
});

exports.deleteAuthTokens = expressAsyncHandler(async (req, res) => {
  const { authTokenIdList } = req.body;

  await AuthToken.destroy({ where: { id: authTokenIdList } });

  res.status(200).json({ success: true });
});
