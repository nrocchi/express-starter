const {Op} = require('sequelize')
const db = require('../../app/helpers/db')
const pagination = require('../../app/helpers/pagination')

exports.getCompanies = async (req) => {
  const page = req.query.page || 1
  const size = req.query.limit || 10
  const order = req.query.order || 'updated_at'
  const orderby = req.query.orderby || 'DESC'
  const search = req.query.search ? req.query.search.toLowerCase() : null
  const {limit, offset} = pagination.getOptions(page, size)

  let where = {}
  if (search) {
    where = {
      [Op.or]: [
        {
          name: {[Op.substring]: `${search}`},
        },
        {
          address: {[Op.substring]: `${search}`},
        },
        {
          zipcode: {[Op.substring]: `${search}`},
        },
        {
          city: {[Op.substring]: `${search}`},
        },
        {
          country: {[Op.substring]: `${search}`},
        },
        {
          countryCode: {[Op.substring]: `${search}`},
        },
      ],
    }
  }

  const results = await db.Company.findAndCountAll({
    where,
    limit,
    offset,
    order: [[order, orderby]],
    attributes: {exclude: ['deleted_at']},
  })

  return pagination.getResults(results, page, limit)
}

exports.getCompany = (type, value) => {
  return db.Company.findOne({
    where: {[type]: value},
    attributes: {exclude: ['deleted_at']},
  })
}

exports.createCompany = async (value) => {
  // Check if company is soft-deleted then restore it otherwise create it
  const company = await db.Company.findOne({
    where: {name: value.name},
    paranoid: false,
  })

  if (company) {
    return db.Company.restore(value)
  }
  return db.Company.create(value)
}

exports.updateCompany = (id, value) => {
  return db.Company.update(value, {
    where: {id},
  })
}

exports.deleteCompany = (id) => {
  return db.Company.destroy({
    where: {id},
  })
}
