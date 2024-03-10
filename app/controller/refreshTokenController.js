const Users = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  console.log(
    "inicio_______________________________________________________________"
  );
  console.log("ON handleRefreshToken");
  try {
    const cookies = req.cookies;
    console.log("cookies do req.cookies: ", cookies);
    const refreshToken = cookies.jwt;
    console.log("refreshToken dos cookies: ", refreshToken);
    const foundUser = await Users.findOne({ refreshToken });
    console.log("foundUser: ", foundUser);

    if (foundUser) {
      console.log("verificando refreshToken:");
      jwt.verify(
        foundUser.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || foundUser.username !== decoded.username) {
            console.log("erro na verificação do refreshToken=> erro:", err);
            return err
              ? res.status(401).json({ message: err })
              : res.sendStatus(403);
            // weak spot 👆
            // return res.sendStatus(403);
          }
          console.log("verificando refreshToken ok!");

          const roles = Object.values(foundUser.roles);
          console.log("Criando novo accessToken");
          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: decoded.username,
                roles: decoded.roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10s" }
          );
          console.log("accessToken criado!");
          console.log("Enviando roles, accessToken e username: ");

          res.status(200).json({
            roles: roles,
            accessToken: accessToken,
            username: foundUser.username,
          });
          console.log(roles);
          console.log(accessToken);
          console.log(foundUser.username);
          console.log(
            "fim_______________________________________________________________"
          );
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleRefreshToken };
