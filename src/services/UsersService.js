const UsersService = module.exports;

const JwtService = require('../utils/JwtService');
const { ADMIN } = require('../utils/Roles');
const UsersRepository = require('../repositories/UsersRepository');
const UserRolesRepository = require('../repositories/UserRolesRepository');

const { TOKEN_EXPIRATION_TIME } = process.env;
const HOURS_TO_SECS = 3600;

UsersService.register = async (userData) => {
  const { password, password2, ...data } = userData;

  const existingUser = await UsersRepository.find({ email: data?.email });

  if (!!existingUser) {
    throw new Error('Already existing user');
  }

  if (password !== password2) {
    throw new Error ('Password mismatch');
  }

  const hashedPassword = await JwtService.hashSecret(password);

  return UsersRepository.create({ ...data, password: hashedPassword});
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
    userId: userId,
  };
};

UsersService.getUserProfile = async (userId) => {
  const user = await UsersRepository.find({ id: userId });
  const role = await UserRolesRepository.getUserRole(userId);
  delete user.password;
  return { ...user, is_admin: role === ADMIN };
};

UsersService.getAllUsers = () => {
  return UsersRepository.findAll();
};
