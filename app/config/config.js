module.exports = {
  // App config
  title: 'Express Starter',
  formatDate: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  regexPassword: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/,
  timeout: 30000,

  // Sequelize CLI config
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  dialectOptions: {
    // useUTC: false,
    dateStrings: true,
    typeCast(field, next) {
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    },
  },
  timezone: '+02:00',
  logging: console.log, // 'console.log' or false to show queries in console
  sync: false, // true or false or 'alter' or 'force' to sync db

  // Elastic config
  esIndexPrefix: 'starter_',
  esSize: 10000000,

  // JWT config
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_auth: '1d',
  jwt_expires_refresh: '7d',
  jwt_expires_reset: '1h',

  // Cache & logs config
  cacheTime: '7 days',
  cacheDebug: false, // true or false to show apicache debug in console
  logDebug: true, // true or false to show logs in console
}
