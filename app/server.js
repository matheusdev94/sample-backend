require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const credentials = require("./middleware/credentials");
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyToken");
const verifyRoles = require("./middleware/verifyRoles");
const verifyRequest = require("./middleware/verifyRequest");

app = express();
connectDB();

app.use(verifyRequest);
app.use(credentials);
app.use(cors(corsOptions));
app.use(logger);

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// app.use("/registerAdminEditor",require("./routes/controller/registerAdminEditor"));
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/controller/auth"));
app.use("/refresh", require("./routes/controller/refresh"));
app.use("/logout", require("./routes/controller/logout"));

app.use("/register", require("./routes/controller/register"));
// app.use("/user", require("./routes/controller/user"));

app.use(verifyJWT);
app.use(verifyRoles);

app.use("/users", require("./routes/api/users"));
app.use("/employees", require("./routes/api/employees"));

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

const PORT = process.env.PORT || 3500;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
