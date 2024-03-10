const User = require("../model/User");

const handleLogout = async (req, res) => {
  console.log(
    "inicio_______________________________________________________________"
  );
  console.log("on handleLogout");
  try {
    const refreshToken = req.cookies.jwt;
    console.log("refreshToken : ", refreshToken);
    if (!refreshToken) {
      console.log("nao ha cookies. atribuindo rt ao valor de cookies.jwt");
      return res.sendStatus(204);
    }
    // const refreshToken = cookies.jwt;
    // console.log("cookies.jwt: ", cookies.jwt);

    const user = await User.findOne({ refreshToken });
    console.log("user apos busca no db: ", user);

    if (!user) {
      console.log("não encontrou o user por esse Rt");
      console.log("limpando os cookies:");
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      console.log("res.cookies: ", res.cookies);
    }

    console.log("limpando rt do user");
    user.refreshToken = "";
    console.log("salvando user com rt vazio no db");
    await user.save();

    console.log("limpando cookies do user no browser: ");
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0, // 1 day
    });
    console.log("\n\n\n\n");
    console.log("res.cookies: ", res.req.cookies);
    // res.setHeader(
    //   "Set-Cookie",
    //   "jwt=; Max-Age=0; Path=/, HttpOnly; SameSite=Strict"
    // );
    // res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    res.sendStatus(204);
  } catch (error) {
    console.log("deu erro: ", error.message);
    res.status(500).json({ error: error.message });
    console.log(10);
  }
  console.log(
    "fim_______________________________________________________________"
  );
};

module.exports = {
  handleLogout,
};
