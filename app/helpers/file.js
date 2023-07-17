const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')

exports.readHTML = async (path) => {
  const spinner = ora().start()
  let file

  try {
    file = fs.readFileSync(`${require('path').resolve('./')}${path}`, 'utf8')
  } catch (err) {
    spinner.fail(chalk.red('File reading failed:', err))

    const error = {
      code: 400,
      message: 'File reading failed.',
      stack: err,
    }

    throw error
  }

  spinner.succeed(chalk.green('File reading succeeded.'))

  return file
}

exports.writeAvatar = async (avatar, id) => {
  const spinner = ora().start()
  const fileName = `${id}_${new Date().getTime()}.png`
  const filePath = `./uploads/images/users/${fileName}`
  const base64 = avatar.replace(/^data:([A-Za-z-+/]+);base64,/, '')
  const fileUrl = `/uploads/images/users/${fileName}`

  try {
    await this.deleteAvatarById(id)

    fs.writeFileSync(filePath, base64, {encoding: 'base64'})

    spinner.succeed(chalk.green('Uploading avatar succeeded.'))

    return fileUrl
  } catch (err) {
    spinner.fail(chalk.red('Uploading avatar failed:', err))
    const error = {
      code: 400,
      message: 'The avatar was not uploaded on the server.',
      stack: err,
    }
    throw error
  }
}

exports.deleteAvatarById = async (id) => {
  const arrayOfFiles = fs.readdirSync('./uploads/images/users')
  arrayOfFiles.map(async (item) => {
    const splited = item.split('_')
    if (splited[0] === id) {
      await this.deleteAvatar(item)
    }
    return false
  })
}

exports.deleteAvatar = async (fileName) => {
  const spinner = ora().start()

  try {
    fs.unlinkSync(`./uploads/images/users/${fileName}`)

    spinner.succeed(chalk.green('Deleting avatar succeeded.'))

    return true
  } catch (err) {
    spinner.fail(chalk.red('Deleting avatar failed:', err))
    const error = {
      code: 400,
      message: 'The avatar was not deleted on the server.',
      stack: err,
    }
    throw error
  }
}
