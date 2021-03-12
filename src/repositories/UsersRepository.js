const UsersRepository = module.exports;

const db = require('../utils/DB');

const TABLE_NAME = 'users';

UsersRepository.create = (data) => db(TABLE_NAME).insert(data).then(([inserted]) => inserted);

UsersRepository.find = (query) => db(TABLE_NAME).where(query).first();

UsersRepository.findAll = () => db(TABLE_NAME).where({});
