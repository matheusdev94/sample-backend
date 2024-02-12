const bcrypt = require("bcrypt");
const User = require("../model/User");

const fsPromises = require("fs").promises;
const path = require("path");
const usersDb = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleUserRegistration = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    // const existingUser = await User.findOne({ username });
    const existingUser = usersDb.users.find(
      (user) => user.username === username
    );

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    usersDb.setUsers([...usersDb.users, newUser]);

    // Save the user to the database
    console.log(usersDb.users, newUser);

    // const savedUser = await newUser.save();
    const savedUser = null;
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(usersDb.users)
    );

    // Exclude password from the response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleUserRegistration,
};
