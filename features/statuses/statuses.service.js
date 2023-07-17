const {Op} = require('sequelize')
const db = require('../../app/helpers/db')
const pagination = require('../../app/helpers/pagination')

exports.getStatuses = async (req) => {
  const page = req.query.page || 1
  const size = req.query.limit || null
  const order = req.query.order || 'id'
  const orderby = req.query.orderby || 'ASC'
  const search = req.query.search ? req.query.search.toLowerCase() : null
  const {limit, offset} = pagination.getOptions(page, size)

  let where = {}
  if (search) {
    where = {
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

  const results = await db.Status.findAndCountAll({
    where,
    limit,
    offset,
    order: [[order, orderby]],
  })

  return pagination.getResults(results, page, limit)
}

exports.getStatus = (type, value) => {
  return db.Status.findOne({where: {[type]: value}})
}
