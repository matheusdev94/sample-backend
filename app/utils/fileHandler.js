const fsPromisses = require("fs").promises;
const writteFile = async (data, path) => {
  fsPromisses.writeFile(path, data, "utf-8");
};
const loadFile = async (path) => {
  fsPromisses.readFile(path, "utf-8");
  return loadFile;
};

module.exports = { writteFile, loadFile };
