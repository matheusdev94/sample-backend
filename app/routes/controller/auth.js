const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");
const passport = require("passport");
const User = require("../../model/User");

router.post("/", authController.handleAuthentication);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),

  async function (req, res) {
    if (res.statusCode === 200) {
      res.cookie("jwt", req.user.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      // res.status(200).json({ accessToken: req.user.accessToken });
      // res.status(200).json({
      //   error: false,
      //   message: "Successfully Loged In",
      //   user: req.user,
      // });
      // res.redirect(process.env.CLIENT_URL);
      res.redirect(process.env.CLIENT_URL);
    }
    //   await authController.handleGoogleOauth.then(()=>{res.redirect()})
  }
);

router.get("/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not authorized",
    });
  }
});
router.get("/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});
router.get("/google", passport.authenticate("google"));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});
module.exports = router;
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.CLIENT_URL,
//   })
// );
