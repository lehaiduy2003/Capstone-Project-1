
require('dotenv').config()
const express = require('express')
const home = require('./routes/homeRoute')
const app = express()

const port = process.env.PORT || 6789
const host = process.env.HOSTNAME

//config req.body
app.use(express.json()) //for json
app.use(express.urlencoded({ extended: true })) //for form data

//khai báo route
app.use('/', home)

app.listen(port, host, () => {
  console.log(`Example app listening on port ${port}`)
})
