const fsPromisses = require("fs").promises;
const writteFile = async (data) => {
  fsPromisses.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    data,
    "utf-8"
  );
};
const loadFile = async () => {
  fsPromisses.readFile(
    path.join(__dirname, "..", "data", "users.json"),
    "utf-8"
  );
  return loadFile;
};

module.exports = { writteFile, loadFile };
