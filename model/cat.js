let mongoose = require('mongoose')

let schema   = new mongoose.Schema({
  updated: { type: Date, default: Date.now },
  cat_id: { type: String },
  hash: String,
  cat: String
})

module.exports = mongoose.model('cat', schema)