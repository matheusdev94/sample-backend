const fsPromises = require("fs").promises;
const path = require("path");
const usersDb = {
  users: require("../data/users.json"),
  setUsers: (data) => {
    this.users = data;
  },
};

const usersRequest = async (req, res) => {
  try {
    return res.sendStatus(200).json(usersDb.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  usersRequest,
};
