const ConfigurationsRepository = module.exports;

const db = require('../utils/DB');

const TABLE_NAME = 'configurations';

ConfigurationsRepository.findAll = () => db(TABLE_NAME).where({});

ConfigurationsRepository.update = (configId, data) => db(TABLE_NAME).update(data).where({ id: configId })
  .returning('*')
  .then(([updated]) => updated);
