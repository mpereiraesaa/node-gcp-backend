const {
  DB_USER,
  DB_NAME,
  DB_PASS,
  DB_SOCKET_PATH,
  CLOUD_SQL_CONNECTION_NAME,
} = process.env;

const dbSocketPath = DB_SOCKET_PATH || '/cloudsql';

module.exports = {
  databaseConfig: {
    client: 'mysql',
    connection: {
      socketPath : `${dbSocketPath}/${CLOUD_SQL_CONNECTION_NAME}`,
      user : DB_USER,
      password : DB_PASS,
      database : DB_NAME
    },
    acquireConnectionTimeout: 5000,
  },
};
