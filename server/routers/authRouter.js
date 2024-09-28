const {
  signUp,
  generateNewAccessToken,
  signIn,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authentication");
const router = require("./router");

router.post("/sign-up", (req, res) => {
  console.log("POST /sign-up");
  signUp(req, res);
});

router.post("/refresh-Access-Token", authenticateToken, (req, res) => {
  console.log("POST /refresh-Access-Token");
  generateNewAccessToken(req, res);
});

router.post("/sign-in", (req, res) => {
  console.log("POST /sign-in");
  signIn(req, res); // Gọi controller signIn để xử lý req
});

module.exports = router;
