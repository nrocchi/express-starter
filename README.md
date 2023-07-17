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
- Multiple environments with cross-env
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

The name of your database must match with the `DB_NAME` variable in your `.env.development` file.

### Setup multiple environments files

**WARNING:** The `NODE_ENV` variable must match with the name of your `.env` file.\
_e.g. The `NODE_ENV` variable of the `.env.test` file must be set to `NODE_ENV=test`_

Create your `.env.development` local file based on the `.env.dist` file:\
Provide your database, tokens, server and SMTP informations in the `.env.development` file.

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

e.g.
- _The `NODE_ENV` variable must be set to `development`_
- _The `SERVER_HOST` variable must be set to `localhost`_
- _The `SERVER_PORT` variable can be set to `4000`_
- _The `WEBSITE_URL` variable must be set with the front-end application URL_ (used in the mail templates to redirect to the front-end application).

The script commands in the `./package.json` file are intended for 3 environments: `development`, `production` & `test`.\
So you can create a `.env.production` local file and a `.env.test` local file with different informations.\
If you do this, you can connect to others databases and servers just by running different script commands.\
e.g.
```
npm run dev:migration
```
```
npm run prod:seed
```

**PROTIP:** You can create as many `.env.{NODE_ENV}` files as you want, you just need to add the corresponding script commands in your `./package.json` file.

### Run the migrations

Migrations are done using the `npm run {environment}:migration` command:
```
npm run dev:migration
```

### Run the seeds

Seeds are done using the `npm run {environment}:seed` command:
```
npm run dev:seed
```

### Start the application

Starting the app is done using the `npm run {environment}:start` command:
```
npm run dev:start
```

Open [http://{SERVER_HOST}:{SERVER_PORT}](http://localhost:4000) to view it in the browser.

### Postman

The `Postman collection` is available at the root of the project `./Express Starter.postman_collection.json`.

The `Postman dev environment` is available at the root of the project `./Express Starter - DEV.postman_environment.json`.

### Documentation

Open [http://{SERVER_HOST}:{SERVER_PORT}/doc](http://localhost:4000/doc) to view the `Swagger documentation` in the browser.

## Available Scripts

Run the app in the development mode.

```console
npm run dev:start
```

Run the app in the production mode.

```console
npm run prod:start
```

Run the tests.

```console
npm run test
```

In the project directory, you can run:

Running commands with npm `npm run [command]`

| environment   | command                  | description                                                              |
| :------------ | :----------------------- | :----------------------------------------------------------------------- |
| `development` | dev                      | Starts a development instance of the app                                 |
| `development` | dev:start                | Starts a nodemon development instance of the app                         |
| `development` | dev:migration            | Apply all the migrations                                                 |
| `development` | dev:migration:undo       | Cancel the last migration                                                |
| `development` | dev:migration:undo:all   | Cancel all the migrations                                                |
| `development` | dev:seed                 | Apply all the seeds                                                      |
| `development` | dev:seed:undo            | Cancel the last seed                                                     |
| `development` | dev:seed:undo:all        | Cancel all the seeds                                                     |
| `development` | dev:seed:debug           | Debug the seeds if errors                                                |
| `production`  | prod                     | Starts a production instance of the app                                  |
| `production`  | prod:start               | Starts a nodemon production instance of the app                          |
| `production`  | prod:migration           | Apply all the migrations                                                 |
| `production`  | prod:migration:undo      | Cancel the last migration                                                |
| `production`  | prod:migration:undo:all  | Cancel all the migrations                                                |
| `production`  | prod:seed                | Apply all the seeds                                                      |
| `production`  | prod:seed:undo           | Cancel the last seed                                                     |
| `production`  | prod:seed:undo:all       | Cancel all the seeds                                                     |
| `production`  | prod:seed:debug          | Debug the seeds if errors                                                |
| `test`        | test                     | Run the tests                                                            |
| `test`        | test:db:create           | Create a test database                                                   |
| `test`        | test:migration           | Apply all the migrations                                                 |
| `test`        | test:migration:undo      | Cancel the last migration                                                |
| `test`        | test:migration:undo:all  | Cancel all the migrations                                                |
| `test`        | test:seed                | Apply all the seeds                                                      |
| `test`        | test:seed:undo           | Cancel the last seed                                                     |
| `test`        | test:seed:undo:all       | Cancel all the seeds                                                     |
| `test`        | test:seed:debug          | Debug the seeds if errors                                                |
| `test`        | pretest                  | Run before the test script and reset the migrations on the test database |
| `test`        | pretest:db:migrate:reset | Cancel the migrations then re-run the migrations on the test database    |
| `all`         | debug                    | Starts the express.js debug mode                                         |
| `all`         | format:check             | Check the Prettier format                                                |
| `all`         | format:write             | Apply the Prettier format                                                |
| `all`         | lint:check               | Check the ESLint format                                                  |
| `all`         | lint:fix                 | Apply the ESLint format                                                  |
| `all`         | swagger                  | Auto generate the Swagger documentation                                  |

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