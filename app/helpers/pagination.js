exports.getOptions = (page, size) => {
  const limit = size ? +size : null
  const offset = page ? (page - 1) * limit : null

  if (page < 1) {
    const error = {
      code: 400,
      message: 'Page must be greater than 1.',
    }
    throw error
  }

  return {limit, offset}
}

exports.getResults = (datas, page, limit) => {
  const {rows: items} = datas

  let total = 0
  if (Array.isArray(datas.count)) {
    total = datas.count.length
  } else {
    total = datas.count
  }

  const current = page ? +page : 1

  const pages = total > 0 && limit ? Math.ceil(total / limit) : 1

  return {items, total, pagination: {current, total: pages}}
}
