const companyService = require('./companies.service')

module.exports = async (req, next) => {
  try {
    const id = req.params.id || null
    const name = req.body.name || null

    const company = await companyService.getCompany('id', id)
    const existingCompany = await companyService.getCompany('name', name)

    // GET, PUT, DELETE METHODS => id
    // Cannot get or update or delete a non existing company => !company
    if (id && !company) {
      const error = {
        code: 400,
        message: 'The company was not found.',
      }
      next(error)
      return false
    }

    // PUT METHOD => company
    //   Cannot update with another existing company name
    //   => existingCompany
    //   But can update himself
    //   => parseInt(id, 10) !== existingCompany.id
    // OR
    // POST METHOD => !company
    //   Cannot create with another existing company name
    //   => existingCompany
    if (
      (company && existingCompany && parseInt(id, 10) !== existingCompany.id) ||
      (!company && existingCompany)
    ) {
      const error = {
        code: 400,
        message: `The ${name} company already exists.`,
      }
      next(error)
      return false
    }

    return company || true
  } catch (error) {
    next(error)
    return false
  }
}
