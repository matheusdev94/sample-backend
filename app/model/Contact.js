const mongoose = require(`mongoose`);
const schema = mongoose.Schema;

const ContactSchema = schema({
  UserInfo: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Contact", ContactSchema);
