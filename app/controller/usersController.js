const User = require("../model/User");

const usersRequest = async (req, res) => {
  console.log(
    "inicio_______________________________________________________________"
  );
  console.log("ON usersController");
  if (req.roles.includes(5150)) {
    try {
      async function getUsers() {
        console.log("Buscando usuários");
        return await User.find({})
          .then((docs) => {
            return docs;
          })
          .catch((err) => {
            console.error(err);
          });
      }

      const users = await getUsers();
      if (users) {
        console.log("usuários encontrados! ieeeeeeeeeeey");
        return res.status(200).json(users);
      }
      console.log(
        "fim_______________________________________________________________"
      );
    } catch (error) {
      console.log(5);
      console.error("err on users: ", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    console.log("user not é admin");

    return res.sendStatus(403);
  }
};

module.exports = {
  usersRequest,
};
