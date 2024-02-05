const verifyRoles = (...allowedRoles) => {
  return (res, req, next) => {
    const userRoles = req.body.roles;
    const rolesArray = [...allowedRoles];
    const result = rolesArray.map((role) => userRoles.includes(role));
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = verifyRoles;
