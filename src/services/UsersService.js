const UsersService = module.exports;

const JwtService = require('../utils/JwtService');
const { ADMIN } = require('../utils/Roles');
const UsersRepository = require('../repositories/UsersRepository');
const UserRolesRepository = require('../repositories/UserRolesRepository');
const ConfigurationsRepository = require('../repositories/ConfigurationsRepository');

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
  let configurations = await ConfigurationsRepository.findAll();

  configurations = configurations.reduce((acc, { value }) => {
    return { ...acc, ...JSON.parse(value) };
  }, {});

  const { disable_passwd: disablePasswd } = configurations;
  const user = await UsersRepository.find({ email });
  const role = await UserRolesRepository.getUserRole(userId);

  if (!disablePasswd) {
    const { password: hashedPassword } = user;
    const isValid = await JwtService.compare(password, hashedPassword);

    if (!isValid) {
      throw new Error('Invalid password');
    }   
  }

  return {
    accessToken: JwtService.generateToken({ userId: user.id, isAdmin: role === ADMIN }),
    expiresIn: TOKEN_EXPIRATION_TIME * HOURS_TO_SECS,
    userId: user.id,
  };
};

UsersService.getUserProfile = async (userId) => {
  const user = await UsersRepository.find({ id: userId });
  const role = await UserRolesRepository.getUserRole(userId);
  delete user.password;
  return { ...user, is_admin: role === ADMIN };
};

UsersService.getAllUsers = async () => {
  const users = await UsersRepository.findAll();
  return users.map(({ password, ...user}) => user);
};
