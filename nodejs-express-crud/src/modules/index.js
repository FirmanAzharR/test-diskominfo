const fs = require("fs");
const path = require("path");
const modules = {};

try {
  let modulePath = path.join(__dirname, "/");

  fs.readdirSync(modulePath)
    .filter((file) => {
      return fs.statSync(modulePath + file).isDirectory();
    })
    .forEach((file1) => {
      let controllerPath = modulePath + file1 + "/controllers/";

      fs.readdirSync(controllerPath).forEach((file2) => {
        let controllerName = file2.slice(0, -3);
        modules[file1 + controllerName] = require(controllerPath +
          controllerName);
      });
    });
} catch (err) {
  console.log(err);
}

module.exports = modules;
