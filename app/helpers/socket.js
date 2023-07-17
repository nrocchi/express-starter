const ora = require('ora')
const chalk = require('chalk')
const util = require('util')
const userService = require('../../features/users/users.service')

module.exports = function (server) {
  const io = require('socket.io')(server)
  let users = []
  let spinner

  // Set io instance to global express variables
  global.io = io

  // Event Listeners
  io.on('connection', (socket) => {
    spinner = ora().start()
    spinner.info(chalk.blue('Socket: Connecting user on socket: ', socket.id))

    socket.on('connected', (data) => {
      spinner = ora().start()
      spinner.info(chalk.blue('Socket: A user is connected: ', socket.id))

      const existingUser = users.findIndex((item) => item.id === data.user.id)

      if (existingUser === -1) {
        users.push({
          socket: socket.id,
          id: data.user.id,
          role: data.user.role.priority,
        })
      } else {
        users[existingUser] = {
          socket: socket.id,
          id: data.user.id,
          role: data.user.role.priority,
        }
      }
    })

    socket.on('disconnect', () => {
      spinner = ora().start()
      spinner.info(chalk.blue('Socket: A user is disconnected: ', socket.id))

      users = users.filter((user) => user.socket !== socket.id)
    })

    socket.on('connect_error', (error) => {
      spinner = ora().start()
      spinner.fail(chalk.red('Socket: Connection error:', error))
    })

    // Emit from client side to all connected users
    socket.on('all', (data) => {
      spinner = ora().start()
      spinner.info(
        chalk.blue('Socket: Sent from client side on channel all: ', data),
      )

      io.emit('all', data)
    })

    // Emit from client side to all connected users except sender
    socket.on('notifications', (data) => {
      spinner = ora().start()
      spinner.info(
        chalk.blue(
          'Socket: Sent from client side on channel notifications: ',
          data,
        ),
      )

      socket.broadcast.emit('notifications', data)
    })

    // Emit from client side to all connected users with a role above the sender role except sender
    socket.on('notifications_roles', async (data) => {
      spinner = ora().start()

      const sender = data.sender.id
        ? data.sender
        : {
            role: {
              priority: 2,
            },
            id: null,
          }

      try {
        const usersConnected = sender.id
          ? users.filter(
              (user) =>
                user.role <= sender.role.priority && user.id !== sender.id,
            )
          : users.filter((user) => user.role <= sender.role.priority)

        if (usersConnected.length > 0) {
          usersConnected.map(async (item) => {
            const notificationsUsers = data.recipient.notifications_users.find(
              (notification) => notification.user_id === item.id,
            )

            const recipient = await userService.getUser('id', item.id)

            const newData = data

            delete newData.sender_id
            delete newData.target_id

            io.to(item.socket).emit('notifications_roles', {
              ...newData,
              recipient: {
                ...recipient,
                notifications_users: notificationsUsers,
              },
            })

            return false
          })

          spinner.info(
            chalk.blue(
              `Socket: Sent from client side on channel notifications_roles: ${util.inspect(
                data,
                {
                  colors: true,
                  depth: null,
                },
              )}`,
            ),
          )
        } else {
          spinner.warn(
            chalk.yellow(
              `Socket: No user connected so not sent from client side on channel notifications_user: ${util.inspect(
                data,
                {
                  colors: true,
                  depth: null,
                },
              )}`,
            ),
          )
        }
      } catch (error) {
        spinner.fail(
          chalk.red(
            'Socket: Not Sent from client side on channel notifications_roles: ',
            error,
          ),
        )
      }
    })

    // Emit from client side to a specific connected user
    socket.on('notifications_user', async (data) => {
      spinner = ora().start()

      try {
        // Find the user connected on the socket
        // (user must be different from sender)
        const user = users.find(
          (item) => item.id === data.target.id && item.id !== data.sender.id,
        )

        if (user) {
          const recipient = await userService.getUser('id', user.id)

          const newData = data

          delete newData.sender_id
          delete newData.target_id

          io.to(user.socket).emit('notifications_user', {
            ...newData,
            recipient: {
              ...recipient,
              notifications_users: data.recipient.notifications_users,
            },
          })

          spinner.info(
            chalk.blue(
              `Socket: Sent from client side on channel notifications_user: ${util.inspect(
                data,
                {
                  colors: true,
                  depth: null,
                },
              )}`,
            ),
          )
        } else {
          spinner.warn(
            chalk.yellow(
              `Socket: No user connected so not sent from client side on channel notifications_user: ${util.inspect(
                data,
                {
                  colors: true,
                  depth: null,
                },
              )}`,
            ),
          )
        }
      } catch (error) {
        spinner.fail(
          chalk.red(
            'Socket: Not Sent from client side on channel notifications_user: ',
            error,
          ),
        )
      }
    })
  })
}

// Emit from server side to all users connected using global io instance
module.exports.broadcast = (channel, data) => {
  const spinner = ora().start()
  spinner.info(
    chalk.blue(
      `Socket: Emitted from server side on channel '${channel}': `,
      data,
    ),
  )
  global.io.emit(channel, data)
}
