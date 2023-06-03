const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const route = require("./routes/userRoute");
const route2 = require("./routes/msgRoute");
const error = require("./utils/error");
const post = require("./routes/postRoute");
const message = require("./routes/msgRoute");
const moment = require("./routes/momentRoute");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
// import routes
app.use("/route", route);
app.use("/post", post);
app.use("/message", message);
app.use("/moment", moment);
app.get("/", (req, res) => {
  res.send("HomePage");
});
app.use("/message", route2);
app.use(error);
module.exports = app;
// npm i express cookie-parser body-parser bcryptjs
