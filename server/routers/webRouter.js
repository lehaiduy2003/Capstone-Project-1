
const { getHomepage } = require('../controllers/homeController')

const router = require('./router')

router.get('/', (req, res) => {
  console.log('GET /');
  //getHomepage(req, res)
})

module.exports = router