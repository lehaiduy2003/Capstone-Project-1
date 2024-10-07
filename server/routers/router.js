const express = require('express')

let router

if (!global.router) {
  global.router = express.Router()
}

router = global.router

module.exports = router