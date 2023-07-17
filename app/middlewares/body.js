module.exports = (_req, res, next) => {
  const oldWrite = res.write
  const oldEnd = res.end
  const chunks = []

  res.write = function write(chunk) {
    chunks.push(Buffer.from(chunk))
    oldWrite.apply(res, arguments)
  }

  res.end = function end(chunk) {
    if (chunk) {
      chunks.push(Buffer.from(chunk))
    }
    const body = Buffer.concat(chunks).toString('utf8')
    res.customBody = body
    oldEnd.apply(res, arguments)
  }
  next()
}
