const UsersController = module.exports;

const UsersService = require('../services/UsersService');

UsersController.register = (req, res, next) => {
  const { body } = req;

  if (!req.file || !req.file.cloudStoragePublicUrl) {
    throw new Error('You must upload an image');
  }

  return UsersService.register({ ...body, image: req.file.cloudStoragePublicUrl })
    .then(() => res.send({ success: true }))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

UsersController.login = (req, res, next) => {
  const { body: { email, password = '' } } = req;

  if (!email) {
    throw new Error('Invalid credentials');
  }

  return UsersService.login(email, password)
    .then((loggedUser) => res.send(loggedUser))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

UsersController.getUserProfile = (req, res, next) => {
  const { params: { userId } } = req;

  return UsersService.getUserProfile(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

UsersController.getAllUsers = (req, res, next) => {
  return UsersService.getAllUsers()
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};
