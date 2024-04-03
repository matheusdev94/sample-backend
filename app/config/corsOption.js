const allowedList = require("./allowedList");
const corsOptions = {
  origin: (origin, callback) => {
    console.log("hit corsOptions", origin);
    console.log("verification:", allowedList.indexOf(origin));
    if (allowedList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //access-control-allow-credentials:true
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
