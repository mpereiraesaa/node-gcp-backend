const UserRolesRepository = module.exports;

const db = require('../utils/DB');

const USER_ROLE_TABLE = 'user_role';
const USERS_TABLE = 'users';
const ROLES_TABLE = 'roles';

UserRolesRepository.getUserRole = (userId) => db
  .select(`${ROLES_TABLE}.*`)
  .from(USERS_TABLE)
  .innerJoin(USER_ROLE_TABLE, function () {
    this.on(`${USER_ROLE_TABLE}.user_id`, '=', `${USERS_TABLE}.id`)
  })
  .innerJoin(ROLES_TABLE, function () {
    this.on(`${ROLES_TABLE}.id`, '=', `${USER_ROLE_TABLE}.role_id`)
  })
  .where(`${USERS_TABLE}.id`, '=', userId)
  .first()
  .then(({ name }) => name);
