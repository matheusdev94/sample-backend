const ROLES_LIST = require("../config/roles_list");

const verifyRoles = (req, res, next) => {
  console.log(
    "inicio_______________________________________________________________"
  );
  console.log("inside of verifyRoles");
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
    console.log(
      "NENHUm ROLE ATRIBUíDO AO USER!!! verificatedRoles: ",
      verificatedRoles
    );
    return res.sendStatus(401);
  }
  console.log(`verificação de roles ok! \nroles do user: ${verificatedRoles}`);
  console.log(
    "fim_______________________________________________________________"
  );
  next();
};
module.exports = verifyRoles;
