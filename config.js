const {
  TIMEZONE = 'America/Buenos_Aires',
  DB_USER,
  DB_NAME,
  DB_PASS,
  DB_INSTANCE,
} = process.env;

module.exports = {
  TIMEZONE,
  DB_CONNECTION: `mysql://${DB_USER}:${DB_PASS}@${DB_INSTANCE}:3306/${DB_NAME}`,
  databaseConfig: {
    client: 'mysql',
    connection: {
      host : DB_INSTANCE,
      user : DB_USER,
      password : DB_PASS,
      database : DB_NAME
    },
    acquireConnectionTimeout: 5000,
  },
};
