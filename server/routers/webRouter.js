const { getHomepage } = require("../controllers/productController");
const authenticateToken = require("../middlewares/authentication");

const router = require("./router");

router.get("/", authenticateToken, (req, res) => {
  console.log("GET /");
  getHomepage(req, res);
});

module.exports = router;
