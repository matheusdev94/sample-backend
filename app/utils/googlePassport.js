const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserGoogleOauth = require("../model/UserGoogleOauth");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("PASSPORT google");
      const userEmail = profile._json.email;

      const search = await UserGoogleOauth.findOne({ username: userEmail });
      if (!search) {
        const user = new UserGoogleOauth({
          username: profile._json.email,
          googleAccessToken: accessToken,
        });
        await user.save();
      }
      const user = await UserGoogleOauth.findOne({ username: userEmail });

      const myRefreshToken = jwt.sign(
        { username: userEmail, roles: user.roles },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const myAccessToken = jwt.sign(
        {
          UserInfo: {
            username: userEmail,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );

      const update = await UserGoogleOauth.updateOne(
        { _id: user._id },
        { refreshToken: myRefreshToken }
      );

      profile.refreshToken = myRefreshToken;
      profile.accessToken = myAccessToken;
      profile.authOrigin = "google";

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
