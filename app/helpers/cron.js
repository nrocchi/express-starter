const cron = require('node-cron')
const chalk = require('chalk')

// Schedule tasks to be run on the server.
exports.firstCron = () => {
  cron.schedule('* * * * *', () => {
    console.log(chalk.magenta('Running cron * * * * *'))
  })
}
