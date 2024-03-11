const User = require("../model/User");

const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      return res.sendStatus(204);
    }

    user.refreshToken = "";

    await user.save();

    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0, // 1 day
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleLogout,
};
