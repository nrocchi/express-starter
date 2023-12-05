# Express Starter

Express + MySQL API for my [React Starter](https://github.com/nrocchi/react-starter).

This project was bootstrapped with [Express.js](https://expressjs.com/).

## Features

- Users management with roles and statuses
- Companies management
- Real-time notifications management with database + websockets
- Auth with JWT token & refresh token
- Auth guard middleware with express-jwt based on user roles
- Database management, migrations and seeds with Sequelize CLI
- Elastic Search with dynamic queries
- Websockets with Socket.io
- Queue system with BullMQ
- Cache system with apicache-plus & redis-client
- Timeout handler
- Validate schemas with Joi
- Custom pagination
- Custom generic error handler
- Periods interval with date-fns
- Send mails with node-mailer
- Mail templates with handlebars
- File upload
- Launch crons with node-cron
- Log files + console with Morgan + Winston
- Testing routes with Jest + Supertest
- Swagger documentation + Postman collection

## Todo

- Complete the Swagger documentation
- Write more tests for api routes with Jest & Supertest

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).\
Before installing, [download and install Node.js](https://nodejs.org/en/download/).\
Node.js 0.10 or higher is required.

### Cloning the repository

```shell
git clone https://github.com/nrocchi/express-starter.git
```

### Install packages

Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```shell
npm install
```

Follow [the express installing guide](http://expressjs.com/en/starter/installing.html) for more information.

### Create a MySQL database for your local environment. (OPTIONAL)

The name of your database must match with the `DB_NAME` variable in your `.env` file.

### Setup .env file

Create your `.env` local file based on the `.env.dist` file:\
Provide your database, tokens, server and SMTP informations in the `.env` file.

```js
NODE_ENV=
SERVER_HOST=
SERVER_PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
ELASTIC_IP=
ELASTIC_PORT=
ELASTIC_USERNAME=
ELASTIC_PASSWORD=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
WEBSITE_URL=
```

### Run the migrations

Migrations are done using the `npm run migration` command:

```shell
npm run migration
```

### Run the seeds

Seeds are done using the `npm run seed` command:

```shell
npm run seed
```

### Start the application

Starting the app is done using the `npm run start` command:

```shell
npm run start
```

Open [http://{SERVER_HOST}:{SERVER_PORT}](http://localhost:4000) to view it in the browser.

### Postman

The `Postman collection` is available at the root of the project `./Express Starter.postman_collection.json`.

The `Postman dev environment` is available at the root of the project `./Express Starter - DEV.postman_environment.json`.

### Documentation

Open [http://{SERVER_HOST}:{SERVER_PORT}/doc](http://localhost:4000/doc) to view the `Swagger documentation` in the browser.

## Available Scripts

Run the app in the development mode.

```shell
npm run dev:start
```

Run the app in the production mode.

```shell
npm run prod:start
```

Run the tests.

```shell
npm run test
```

In the project directory, you can run:

Running commands with npm `npm run [command]`

| command              | description                                                              |
| :------------------- | :----------------------------------------------------------------------- |
| dev                  | Starts a development instance of the app                                 |
| start                | Starts a nodemon development instance of the app                         |
| migration            | Apply all the migrations                                                 |
| migration:undo       | Cancel the last migration                                                |
| migration:undo:all   | Cancel all the migrations                                                |
| seed                 | Apply all the seeds                                                      |
| seed:undo            | Cancel the last seed                                                     |
| seed:undo:all        | Cancel all the seeds                                                     |
| seed:debug           | Debug the seeds if errors                                                |
| test                 | Run the tests                                                            |
| debug                    | Starts the express.js debug mode                                         |
| format:check             | Check the Prettier format                                                |
| format:write             | Apply the Prettier format                                                |
| lint:check               | Check the ESLint format                                                  |
| lint:fix                 | Apply the ESLint format                                                  |
| swagger                  | Auto generate the Swagger documentation                                  |

## Application config

Use `./app/config/config.js` file

```js
{
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
  logging: false, // 'console.log' or false to show queries in console
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
  logDebug: false, // true or false to show logs in console
}
```

## Express.js Docs & Community

- [Website and Documentation](http://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
- [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
- Visit the [Wiki](https://github.com/expressjs/express/wiki)

## Contributors

The original author is [Nicolas Rocchi](https://github.com/nrocchi).
