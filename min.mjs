import {minify} from "minify";

var options = {
  js: {
    keep_fnames: true,
    keep_classnames: true,
    sourceMap: {
      filename: "home.js.map",
      url: "/js/home.js.map"
    },
    format: {
      comments: false,
    },
    mangle: false
  }
};
// yo this is broken.
async function run() {
  //minify("./assets/js/home.js", options, function(error, data) {
  //  console.log(error);
  //});
  console.log('fucker');
  try {
    minify.js("function hello() { console.log('whyyy'); }", function(error, data) {
      console.log('fuck');
      console.log(error, data);
    });
  } catch(err) {
    console.log(err);
  }

}

run();
