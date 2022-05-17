const { minify } = require("terser");
var fs = require("fs");

var fileName = "./assets/js/home.js";

var options = {
  keep_fnames: true,
  keep_classnames: true,
  sourceMap: {
    filename: "home.js",
    url: "https://quotle.dev/js/home.js.map",
  },
  format: {
    comments: false,
  },
  mangle: false,
};

(async () => {
  try {
    var result = await minify(fs.readFileSync(fileName, "utf8"), options);

    console.log("Done minifying...");

    fs.writeFileSync("./assets/js/home.min.js", result.code, "utf8");
    fs.writeFileSync("./assets/js/home.js.map", result.map, "utf8");

    console.log("Done writing...");
    console.log("Done...");
  } catch (err) {
    const { message, filename, line, col, pos } = err;
    console.log(`'${filename}':${line},${col}-- ${message}`);
  }
})();
