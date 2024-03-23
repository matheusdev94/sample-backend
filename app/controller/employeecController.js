const jwt = require("jsonwebtoken");
const Employee = require("../model/Employees");

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createEmployee = async (req, res) => {
  try {
    const anticsrf = req.headers.anticsrf;

    if (!anticsrf) {
      return res.status(403);
    }
    jwt.verify(anticsrf, process.env.ANTI_CSRF_SECRET, async (err) => {
      if (err) {
        return res.status(403);
      } else {
        const { firstname, lastname } = req.body;

        const newEmployee = new Employee({
          firstname: firstname,
          lastname: lastname,
        });
        await newEmployee.save();
        res.status(201).json(newEmployee);
      }
    });
  } catch (error) {
    console.error("err on add empl: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { firstname, lastname },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
