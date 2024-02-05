const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const generateToken = (data, expirationTime) => {
  const secretKey = process.env.REFRESH_TOKEN_SECRET;

  const token = jwt.sign(data, secretKey, { expiresIn: expirationTime });
  return token;
};

const handleAuthentication = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const roles = Object.values(user.roles).filter(Boolean);

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate an access token
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

    // Save the access token to the user in the database

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Respond with the access token
    res.status(200).json({ roles, accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleAuthentication,
};
