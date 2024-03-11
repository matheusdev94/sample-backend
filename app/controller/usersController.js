const User = require("../model/User");

const usersRequest = async (req, res) => {
  if (req.roles.includes(5150)) {
    try {
      async function getUsers() {
        return await User.find({})
          .then((docs) => {
            return docs;
          })
          .catch((err) => {
            return res.sendStatus(500);
          });
      }

      const users = await getUsers();
      if (users) {
        return res.status(200).json(users);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.sendStatus(403);
  }
};

module.exports = {
  usersRequest,
};
