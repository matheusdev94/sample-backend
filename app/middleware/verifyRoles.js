const ROLES_LIST = require("../config/roles_list");

const verifyRoles = (req, res, next) => {
  const userRoles = req.roles;

  let result = false;
  console.log("ROLES: ", typeof userRoles);
  for (let index in userRoles) {
    if (userRoles[index] === 5150) {
      result = true;
    }
  }
  if (!result) {
    return res.sendStatus(401);
  }

  next();
};
module.exports = verifyRoles;
