const Employee = require("../model/Employees");

const createEmployee = async (req, res) => {
  try {
    const { firstname, lastname } = req.body;
    const newEmployee = new Employee({ firstname, lastname });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
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
    const { id } = req.params;
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
