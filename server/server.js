
require('dotenv').config()
const express = require('express')
const cors = require('cors');
const webRouter = require('./routers/webRouter')
const authRouter = require('./routers/authRouter')
const app = express()

const port = process.env.PORT
const host = process.env.HOSTNAME

//config req.body
// app.use(express.json()) //for json
// app.use(express.urlencoded({ extended: true })) //for form data

app.use(cors({
  origin: '*'
}))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//khai báo route
app.use('/', webRouter)
app.use('/auth', authRouter)

app.listen(port, host, () => {
  console.log(`app listening on hostname ${host} and port ${port}`)
})
