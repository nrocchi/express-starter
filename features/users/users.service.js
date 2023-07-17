const {Op} = require('sequelize')
const bcrypt = require('bcryptjs')

const db = require('../../app/helpers/db')
const pagination = require('../../app/helpers/pagination')
const file = require('../../app/helpers/file')
// const periodHelper = require('../../app/helpers/period')

exports.getUsers = async (req) => {
  const page = req.query.page || 1
  const size = req.query.limit || 10
  const order = req.query.order || 'updated_at'
  const orderby = req.query.orderby || 'DESC'
  const search = req.query.search ? req.query.search.toLowerCase() : null
  const role = req.query.role_id ? req.query.role_id : null
  const status = req.query.status_id ? req.query.status_id : null
  const {limit, offset} = pagination.getOptions(page, size)

  let whereSearch = {}
  let whereRole = {}
  let whereStatus = {}

  if (search) {
    whereSearch = {
      [Op.or]: [
        {
          email: {[Op.substring]: `${search}`},
        },
        {
          username: {[Op.substring]: `${search}`},
        },
        {
          firstname: {[Op.substring]: `${search}`},
        },
        {
          lastname: {[Op.substring]: `${search}`},
        },
      ],
    }
  }

  if (role) {
    whereRole = {role_id: role}
  }

  if (status) {
    whereStatus = {status_id: status}
  }

  const results = await db.User.findAndCountAll({
    raw: true,
    nest: true,
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
    include: [
      {
        model: db.Role,
        as: 'role',
        // Cannot get users with role above the current user role priority
        where: req.user && {priority: {[Op.gte]: req.user.role.priority}},
      },
      {
        model: db.Status,
        as: 'status',
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    where: [whereSearch, whereRole, whereStatus],
    limit,
    offset,
    order: [[order, orderby]],
  })

  return pagination.getResults(results, page, limit)
}

exports.getUsersByPeriod = async (periods) => {
  const current = await db.User.findAndCountAll({
    raw: true,
    nest: true,
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
    include: [
      {
        model: db.Role,
        as: 'role',
      },
      {
        model: db.Status,
        as: 'status',
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    where: [
      {created_at: {[Op.gte]: periods.current.start}},
      {created_at: {[Op.lte]: periods.current.end}},
    ],
  })

  const previous = await db.User.findAndCountAll({
    raw: true,
    nest: true,
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
    include: [
      {
        model: db.Role,
        as: 'role',
      },
      {
        model: db.Status,
        as: 'status',
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    where: [
      {created_at: {[Op.gte]: periods.previous.start}},
      {created_at: {[Op.lte]: periods.previous.end}},
    ],
  })
  return {current, previous}
}

exports.getActiveUsersByRoles = async (rolePriority) => {
  const order = 'id'
  const orderby = 'ASC'

  const results = await db.User.findAndCountAll({
    raw: true,
    nest: true,
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
    include: [
      {
        model: db.Role,
        as: 'role',
        // Cannot get users with role below the role priority
        where: {priority: {[Op.lte]: rolePriority}},
      },
      {
        model: db.Status,
        as: 'status',
        // Cannot get users with status inactive or pending
        where: {id: 1},
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    order: [[order, orderby]],
  })

  return results
}

exports.getUser = (type, value) => {
  return db.User.findOne({
    raw: true,
    nest: true,
    where: {[type]: value},
    include: [
      {
        model: db.Role,
        as: 'role',
      },
      {
        model: db.Status,
        as: 'status',
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
  })
}

exports.getUserWithPassword = (type, value) => {
  return db.User.scope('withPassword').findOne({
    raw: true,
    nest: true,
    where: {[type]: value},
    include: [
      {
        model: db.Role,
        as: 'role',
      },
      {
        model: db.Status,
        as: 'status',
      },
      {
        model: db.Company,
        as: 'company',
        attributes: {exclude: ['deleted_at']},
      },
    ],
    attributes: {exclude: ['role_id', 'status_id', 'company_id', 'deleted_at']},
  })
}

exports.createUser = async (value) => {
  // Check if user is soft-deleted then restore it otherwise create it
  const existingUser = await db.User.findOne({
    where: {email: value.email},
    paranoid: false,
  })

  if (existingUser) {
    return db.User.restore(value)
  }

  const valueWithoutAvatar = {...value}
  delete valueWithoutAvatar.avatar

  // let userToCreate
  const userToCreate = {...valueWithoutAvatar}

  if (value.password) {
    const hash = bcrypt.hashSync(value.password, 10)
    userToCreate.password = hash
  }

  const user = await db.User.create(userToCreate)

  if (value.avatar) {
    const fileUrl = await file.writeAvatar(value.avatar, user.id)

    if (fileUrl) {
      const userToUpdate = this.getUser('id', user.id)
      userToUpdate.avatar = fileUrl

      await db.User.update(userToUpdate, {
        where: {id: user.id},
      })
    }
  }

  return this.getUser('id', user.id)
}

exports.createUserPassword = async (id, value) => {
  const userToUpdate = {...value}

  if (value.password) {
    const hash = bcrypt.hashSync(value.password, 10)
    userToUpdate.password = hash
  }

  userToUpdate.invitation_token = null
  userToUpdate.status_id = 1

  return db.User.update(userToUpdate, {
    where: {id},
  })
}

exports.updateUser = async (id, value) => {
  const userToUpdate = {...value}

  if (value.password) {
    const hash = bcrypt.hashSync(value.password, 10)
    userToUpdate.password = hash
  }

  if (value.avatar) {
    const fileUrl = await file.writeAvatar(value.avatar, id)

    if (fileUrl) {
      userToUpdate.avatar = fileUrl
    }
  } else {
    const existingUser = await this.getUser('id', id)

    // WE UPDATE THE USER WITHOUT AN AVATAR (avatar = null)
    // IF THE USER ALREADY HAVE AN AVATAR WE WANT TO DELETE IT FROM THE SERVER
    if (existingUser.avatar && value.avatar === null) {
      await file.deleteAvatarById(id)

      userToUpdate.avatar = null
    }
  }

  return db.User.update(userToUpdate, {
    where: {id},
  })
}

exports.updateUserPassword = async (id, value) => {
  const userToUpdate = {...value}

  if (value.password) {
    const hash = bcrypt.hashSync(value.newPassword, 10)
    userToUpdate.password = hash
  }

  return db.User.update(userToUpdate, {
    where: {id},
  })
}

exports.resetUserPassword = async (id, value) => {
  const userToUpdate = {...value}

  if (value.password) {
    const hash = bcrypt.hashSync(value.password, 10)
    userToUpdate.password = hash
  }

  userToUpdate.reset_token = null

  return db.User.update(userToUpdate, {
    where: {id},
  })
}

exports.deleteUser = async (id) => {
  const userToDelete = await this.getUser('id', id)

  // IF THE USER ALREADY HAVE AN AVATAR WE WANT TO DELETE IT FROM THE SERVER
  // AND WE UPDATE THE USER WITHOUT AN AVATAR (avatar = null) BEFORE PARANOID DELETING
  // (IF WE RESTORE THE USER LATER HE WILL NOT HAVE AN AVATAR)
  if (userToDelete.avatar) {
    await file.deleteAvatarById(id)

    userToDelete.avatar = null

    await db.User.update(userToDelete, {
      where: {id},
    })
  }

  return db.User.destroy({
    where: {id},
  })
}
