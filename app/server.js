const express = require("express");
app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

require("dotenv").config();

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/controller/register"));
app.use("/auth", require("./routes/controller/auth"));
app.use("/refresh", require("./routes/controller/refresh"));
app.use("/logout", require("./routes/controller/logout"));

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

//middleware para geração de logs de erro:
app.use(errorHandler);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose.connection.on("error", (err) => {
  console.error(`Error on MongoDB Connection: ${err}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
