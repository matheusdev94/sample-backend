const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.send("live");
});

module.exports = router;
