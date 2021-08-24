const basicInfo = require("./basicInfo");
const servers = require("./servers");
const components = require("./components");
const tags = require("./tags");
const authen = require("./authen");

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...authen,
};
