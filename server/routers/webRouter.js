const { getHomepage } = require("../controllers/homeController");

const router = require("./router");

router.get("/", (req, res) => {
  console.log("GET /");
  res.send("Hello World");
});

module.exports = router;
