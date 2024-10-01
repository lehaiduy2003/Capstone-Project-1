const { getHomepage } = require("../controllers/homeController");
const authenticateToken = require("../middlewares/authentication");

const router = require("./router");

router.get("/", authenticateToken, (req, res) => {
  console.log("GET /");
  res.send("Hello World");
});

module.exports = router;
