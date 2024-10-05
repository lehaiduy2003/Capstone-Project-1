const {
  signUp,
  generateNewAccessToken,
  signIn,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authentication");
const router = require("./router");

router.post("/sign-up", (req, res) => {
  console.log("POST /auth/sign-up");
  signUp(req, res);
});

router.post("/refresh-Access-Token", authenticateToken, (req, res) => {
  console.log("POST /refresh-Access-Token");
  generateNewAccessToken(req, res);
});

router.post("/sign-in", (req, res) => {
  console.log("POST /auth/sign-in");
  signIn(req, res); // Gọi controller signIn để xử lý req
});

// router.post("/sign-out", authenticateToken, (req, res) => {
//   // Xử lý signOut ở phía server (ví dụ: lưu token vào blacklist)
//   // ...
//   res.sendStatus(200);
// });

module.exports = router;
