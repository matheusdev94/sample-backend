const User = require("../model/User");

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    user.refreshToken = "";
    await user.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    res.status(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleLogout,
};
