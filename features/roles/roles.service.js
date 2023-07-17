const {Op} = require('sequelize')
const db = require('../../app/helpers/db')
const pagination = require('../../app/helpers/pagination')

exports.getRoles = async (req) => {
  const page = req.query.page || 1
  const size = req.query.limit || null
  const order = req.query.order || 'id'
  const orderby = req.query.orderby || 'ASC'
  const search = req.query.search ? req.query.search.toLowerCase() : null
  const {limit, offset} = pagination.getOptions(page, size)

  // Cannot get roles above the current user role priority
  let where = req.user && {priority: {[Op.gte]: req.user.role.priority}}

  if (search) {
    where = {
      ...where,
      [Op.or]: [
        {
          code: {[Op.substring]: `${search}`},
        },
        {
          name: {[Op.substring]: `${search}`},
        },
      ],
    }
  }

  const results = await db.Role.findAndCountAll({
    where,
    limit,
    offset,
    order: [[order, orderby]],
  })

  return pagination.getResults(results, page, limit)
}

exports.getRole = (type, value) => {
  return db.Role.findOne({where: {[type]: value}})
}
