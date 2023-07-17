const {Client} = require('@elastic/elasticsearch')

const elastic = new Client({
  node: `http://${process.env.ELASTIC_IP}:${process.env.ELASTIC_PORT}`,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
})

module.exports = elastic
