const ConfigurationsController = module.exports;

const ConfigurationsService = require('../services/ConfigurationsService');

ConfigurationsController.update = (req, res, next) => {
  const { body, params: { configurationId } } = req;

  return ConfigurationsService.update(configurationId, body)
    .then(() => res.send({ success: true }))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

ConfigurationsController.getAll = (req, res, next) => {
  return ConfigurationsService.getAll()
    .then((configurations) => res.send(configurations))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};
