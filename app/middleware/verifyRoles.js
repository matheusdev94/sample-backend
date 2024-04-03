const ROLES_LIST = require("../config/roles_list");

const verifyRoles = (req, res, next) => {
  const userRoles = req.roles;

  let result = false;
  const verificatedRoles = [];
  for (const [role, roleID] of Object.entries(ROLES_LIST)) {
    if (userRoles.includes(roleID)) {
      // rolesVerification[role] = userRoles.includes(roleID);
      verificatedRoles.push(roleID);
      result = true;
    }
  }
  if (!result) {
    return res.sendStatus(401);
  }

  next();
};
module.exports = verifyRoles;
