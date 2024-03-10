const express = require("express");
const router = express.Router();
const adminEditorRegistration = require("../../controller/registerAdminEditor");

router.post("/", adminEditorRegistration.handleAdminEditorRegistration);

module.exports = router;
