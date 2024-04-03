const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserGoogleSchema = schema({
  username: { type: String, required: true },
  refreshToken: { type: String },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
  },
});

module.exports = mongoose.model("UserGoogle", UserGoogleSchema);
