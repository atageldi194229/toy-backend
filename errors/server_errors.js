class ServerError extends Error {
  constructor(message, originalName) {
    super(message);
    this.name = this.constructor.name;
    this.mess = message;
    this.originalName = originalName;
  }
}

class DatabaseError extends ServerError {
  constructor(message) {
    super(message);
  }
}

class IncorrectPasswordError extends ServerError {
  constructor() {
    super("incorrect password bro");
  }
}

class UnimplementedError extends ServerError {
  constructor() {
    super("Unimplemented error");
  }
}

class UserNotFound extends ServerError {
  constructor() {
    super("User not found");
  }
}

class UserExists extends ServerError {
  constructor() {
    super("User already exists");
  }
}

class TokenNotFound extends ServerError {
  constructor() {
    super("Token not found, please check logged devices for security purposes");
  }
}

class UserNotVerified extends ServerError {
  constructor() {
    super("User not verified");
  }
}

class Unauthorized extends ServerError {
  constructor() {
    super("User not authorized");
  }
}

class TokenExpired extends ServerError {
  constructor() {
    super(
      "Token is expired, please check logged devices for security purposes"
    );
  }
}

class TokenDecodeError extends ServerError {
  constructor() {
    super("Could not decode token");
  }
}

exports.ServerError = ServerError;
exports.DatabaseError = DatabaseError;
exports.IncorrectPasswordError = IncorrectPasswordError;
exports.UnimplementedError = UnimplementedError;
exports.UserNotFound = UserNotFound;
exports.UserExists = UserExists;
exports.TokenNotFound = TokenNotFound;
exports.UserNotVerified = UserNotVerified;
exports.Unauthorized = Unauthorized;
exports.TokenExpired = TokenExpired;
exports.TokenDecodeError = TokenDecodeError;
