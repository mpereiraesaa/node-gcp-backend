const UsersService = module.exports;

const JwtService = require('../utils/JwtService');
const { ADMIN } = require('../utils/Roles');
const UsersRepository = require('../repositories/UsersRepository');
const UserRolesRepository = require('../repositories/UserRolesRepository');

const { TOKEN_EXPIRATION_TIME } = process.env;
const HOURS_TO_SECS = 3600;

UsersService.register = (userData) => {
  return UsersRepository.create(userData);
};

UsersService.login = async (email, password) => {
  const { password: hashedPassword, id: userId } = await UsersRepository.find({ email });
  const isValid = await JwtService.compare(password, hashedPassword);

  if (!isValid) {
    throw new Error('Invalid password');
  }

  const role = await UserRolesRepository.getUserRole(userId);

  return {
    accessToken: JwtService.generateToken({ userId, isAdmin: role === ADMIN }),
    expiresIn: TOKEN_EXPIRATION_TIME * HOURS_TO_SECS,
  };
};

UsersService.getUserProfile = (userId) => {
  return UsersRepository.find({ id: userId });
};

UsersService.getAllUsers = () => {
  return UsersRepository.findAll();
};
