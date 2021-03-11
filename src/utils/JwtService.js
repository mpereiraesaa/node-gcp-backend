const JwtService = module.exports;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  SECRET,
  TOKEN_ISSUER,
  TOKEN_EXPIRATION_TIME,
} = process.env;

const saltRounds = 12;

JwtService.generateToken = (payload) => {
  const signOptions = {
    issuer: TOKEN_ISSUER,
    expiresIn: `${TOKEN_EXPIRATION_TIME}h`,
    algorithm: 'HS256',
  };

  return jwt.sign(payload, SECRET, signOptions);
};

JwtService.hashSecret = secret => bcrypt.hash(secret, saltRounds);

JwtService.compare = (secret, hashedSecret) => bcrypt.compare(secret, hashedSecret);

JwtService.verifyToken = (token) => {
  const verifyOptions = {
    issuer: TOKEN_ISSUER,
    expiresIn: `${TOKEN_EXPIRATION_TIME}h`,
    algorithm: ['HS256'],
  };

  return jwt.verify(token, SECRET, verifyOptions);
};
