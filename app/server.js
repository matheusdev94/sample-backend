require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const PORT = process.env.PORT || 3500;

const corsOptions = require("./config/corsOption");
const connectDB = require("./config/dbConn");

// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const passportSetup = require("./utils/googlePassport");
const { errorHandler } = require("./middleware/errorHandler");
const verifyRequest = require("./middleware/verifyRequest");
const verifyRoles = require("./middleware/verifyRoles");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyToken");
const { logger } = require("./middleware/logEvents");

app = express();
connectDB();
const cookieSession = require("cookie-session");
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet({ xssFilter: true }));
app.use(verifyRequest);
app.use(credentials);
app.use(cors(corsOptions));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/register", require("./routes/controller/register"));
app.use("/refresh", require("./routes/controller/refresh"));
app.use("/logout", require("./routes/controller/logout"));
app.use("/auth", require("./routes/controller/auth"));
app.use("/", require("./routes/root"));

app.use(verifyJWT);
app.use(verifyRoles);

app.use("/form", require("./routes/controller/antiCsrf"));
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose.connection.on("error", (err) => {
  console.error(`Error on MongoDB Conne   ction: ${err}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
//
