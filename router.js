let cors     = require('cors')
let mongoose = require('mongoose')
let cat      = require('./model/cat.js')


module.exports = (router) => {
  router.use(cors())

  router.get('/', cors(), (req, res, next) => {
    cat.find({}, function (err, c) {
      if (err) return next(err)
      res.json(c)
    })
  })

  router.get('/clear', cors(), (req, res, next) => {
    cat.remove({}, function (err, c) {
      if (err) return next(err)
      res.json(c)
    })
  })
}