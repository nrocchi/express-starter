const apicache = require('apicache-plus')

const companyService = require('./companies.service')
const companyValidate = require('./companies.validate')

exports.getCompanies = async (req, res, next) => {
  try {
    const results = await companyService.getCompanies(req)

    req.apicacheGroup = 'companies'

    return res.json({
      status: 'success',
      message: 'The companies has been retrieved!',
      datas: results.items,
      total: results.total,
      pagination: results.pagination,
    })
  } catch (error) {
    next(error)
    return false
  }
}

exports.getCompany = async (req, res, next) => {
  const company = await companyValidate(req, next)

  if (company) {
    req.apicacheGroup = `companies/${req.params.id}`

    return res.json({
      status: 'success',
      message: 'The company has been retrieved!',
      datas: company,
    })
  }
  return false
}

exports.createCompany = async (req, res, next) => {
  const valid = await companyValidate(req, next)

  if (valid) {
    try {
      const company = await companyService.createCompany(req.body)

      if (company === 1) {
        const restoredCompany = await companyService.getCompany(
          'name',
          req.body.name,
        )

        if (restoredCompany) {
          apicache.clear('companies')

          return res.json({
            status: 'success',
            message: `The company ${req.body.name} has been restored!`,
            datas: restoredCompany,
          })
        }

        const error = {
          code: 400,
          message: 'The company was not found.',
        }
        next(error)
        return false
      }

      if (company) {
        apicache.clear('companies')

        return res.json({
          status: 'success',
          message: `The company ${req.body.name} has been created!`,
          datas: company,
        })
      }

      const error = {
        code: 400,
        message: 'The company has not been created.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.updateCompany = async (req, res, next) => {
  const company = await companyValidate(req, next)

  if (company) {
    try {
      const [result] = await companyService.updateCompany(
        req.params.id,
        req.body,
      )

      if (result === 1) {
        const updatedCompany = await companyService.getCompany(
          'id',
          req.params.id,
        )

        if (updatedCompany) {
          apicache.clear('companies')
          apicache.clear(`companies/${req.params.id}`)

          return res.json({
            status: 'success',
            message: `The company ${updatedCompany.name} has been edited!`,
            datas: updatedCompany,
          })
        }

        const error = {
          code: 400,
          message: 'The company was not found.',
        }
        next(error)
        return false
      }

      const error = {
        code: 400,
        message: 'The company has not been edited.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}

exports.deleteCompany = async (req, res, next) => {
  const company = await companyValidate(req, next)

  if (company) {
    try {
      const result = await companyService.deleteCompany(req.params.id)

      if (result === 1) {
        apicache.clear('companies')
        apicache.clear(`companies/${req.params.id}`)

        return res.json({
          status: 'success',
          message: `The company ${company.name} has been deleted!`,
        })
      }

      const error = {
        code: 400,
        message: 'The company has not been deleted.',
      }
      next(error)
      return false
    } catch (error) {
      next(error)
      return false
    }
  }
  return false
}
