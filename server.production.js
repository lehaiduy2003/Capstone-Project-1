require("dotenv").config();
const express = require("express");
const cors = require("cors");
const webRouter = require("./routers/webRouter");
const authRouter = require("./routers/authRouter");
const app = express();
const apiRouter = require("./routers/apiRouter");
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;
//config req.body
// app.use(express.json()) //for json
// app.use(express.urlencoded({ extended: true })) //for form data

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//khai báo route
app.use("/", webRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter); // Khai báo router cho homepage

const dbURL = process.env.DATABASE_URL;
mongoose.connect(dbURL, { serverSelectionTimeoutMS: 30000 }); // Timeout 30 giây

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
