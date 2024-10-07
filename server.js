require("dotenv").config();
const express = require("express");
const cors = require("cors");
const webRouter = require("./routers/webRouter");
const authRouter = require("./routers/authRouter");
const app = express();
const homeRouter = require("./routers/homeRouter");
const mongoose = require("mongoose");

const port = process.env.PORT;
const host = process.env.HOSTNAME;

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
app.use("/api", homeRouter); // Khai báo router cho homepage

const DATABASE_URL =
  "mongodb+srv://cap1:wCENzBax5N2h0Y49@cluster0.lpiqm.mongodb.net/EcoTrade?retryWrites=true&w=majority"; // Thay bằng URL của bạn
mongoose.connect(DATABASE_URL, { serverSelectionTimeoutMS: 30000 }); // Timeout 30 giây

app.listen(port, host, () => {
  console.log(`app listening on hostname ${host} and port ${port}`);
});