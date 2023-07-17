exports.getLowercase = (value) => {
  return value.toLowerCase()
}

exports.getUppercase = (value) => {
  return value.toUpperCase()
}

exports.getCapitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

exports.getSlug = (value) => {
  return value.replace(/\s+/g, '-')
}

exports.getUnderscore = (value) => {
  return value.replace(/\s+/g, '_')
}
