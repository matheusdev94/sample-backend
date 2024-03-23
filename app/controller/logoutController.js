const UserGoogleOauth = require("../model/UserGoogleOauth");
const User = require("../model/User");

const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    const user =
      (await User.findOne({ refreshToken: refreshToken })) ||
      (await UserGoogleOauth.findOne({ refreshToken: refreshToken }));

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      return res.sendStatus(204);
    }

    user.refreshToken = "";

    await user.updateOne({
      _id: user.id,
      refreshToken: "",
    });

    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0, // 1 day
    });
    res.cookie("connect.sid", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0, // 1 day
    });
    res.session.destroy((err) => {
      if (err) {
        console.error("Erro ao destruir a sessão:", err);
        return res.status(500).send("Erro ao fazer logout");
      }
    });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleLogout,
};
