const fs = require("fs");
const path = require("path");
const modules = {};
const ENV = process.env.ENV;

try {
  let modulePath = path.join(__dirname, "/");
  fs.readdirSync(modulePath)
    .filter((file) => {
      if (ENV == "TEST") {
        return file.split(".").includes("test");
      } else {
        return (
          !file.split(".").includes("test") &&
          !file.split(".").includes("index")
        );
      }
    })
    .forEach((file1) => {
      let fileName = file1;
      let modelName = file1.slice(0, -3).replace(".test", "");
      modules[modelName] = require(modulePath + fileName);
    });
} catch (err) {
  console.log(err);
}

module.exports = modules;
