const knex = require('./../helpers/init_knex')
const createError = require('http-errors')

module.exports = {
  insert: async (data) => {
    return new Promise((resolve, reject) => {
      try {
        const doesInsert = knex('files').insert(data)
        resolve(doesInsert)
      } catch (error) {
        console.log(error.message)
        reject(createError.InternalServerError())
      }
    })
  },
  select: async () => {
    return new Promise((resolve, reject) => {
      try {
        const doesSelect = knex('files').select()
        resolve(doesSelect)
      } catch (error) {
        console.log(error.message)
        reject(createError.InternalServerError())
      }
    })
  },
  delete: async (floderName) => {
    return new Promise((resolve, reject) => {
      try {
        const doesDelete = knex('files').where('floderName', floderName).del()
        resolve(doesDelete)
      } catch (error) {
        console.log(error.message)
        reject(createError.InternalServerError())
      }
    })
  }
}
