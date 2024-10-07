// server/routers/homeRouter.js
const { getHomepage } = require("../controllers/homeController");
const router = require("./router");

router.get("/homepage", getHomepage);

module.exports = router;
