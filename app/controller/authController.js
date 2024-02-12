const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const fsPromises = require("fs").promises;
const path = require("path");
const usersDb = {
  users: require("../data/users.json"),
  setUsers: (data) => {
    this.users = data;
  },
};
const generateToken = (data, expirationTime) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET;

  const token = jwt.sign(data, secretKey, { expiresIn: expirationTime });
  return token;
};

const handleAuthentication = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = usersDb.users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password error" });
    }

    const roles = Object.values(user.roles).filter(Boolean);

    const accessToken = generateToken(
      {
        userInfo: {
          username: username,
          roles: roles,
        },
      },
      "60s"
    );
    const refreshToken = generateToken(
      { username: username, roles: roles },
      "1d"
    );

    user.refreshToken = refreshToken;

    const filteredUsers = usersDb.users.filter(
      (user) => user.username !== username
    );
    usersDb.setUsers([...filteredUsers, user]);
    // const sortedUsers = usersFiltered.sort((a, b) =>
    //   a.id < b.id ? 1 : a.id > b.id ? -1 : 0
    // );
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(usersDb.users)
    );
    // await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ roles, accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleAuthentication,
};
