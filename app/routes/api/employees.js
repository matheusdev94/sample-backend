const express = require("express");
const router = express.Router();
const employeeController = require("../../controller/employeecController");
router
  .route("/")
  .get(employeeController.getEmployees)
  .post(employeeController.getEmployees)
  .put(employeeController.createEmployee)
  .delete(employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployeeById);
module.exports = router;
