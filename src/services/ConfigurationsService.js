const ConfigurationsService = module.exports;

const ConfigurationsRepository = require('../repositories/ConfigurationsRepository');

ConfigurationsService.update = (configurationId, data) => {
  return ConfigurationsRepository.update(configurationId, JSON.stringify(data));
};

ConfigurationsService.getAll = async () => {
  const configurations = await ConfigurationsRepository.findAll();
  return configurations.reduce((acc, { value }) => {
    return { ...acc, ...JSON.parse(value) };
  }, {});
}
