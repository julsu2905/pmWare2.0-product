const authen = require("./authen");
module.exports = {
  paths: {
    "/login": {
      ...authen,
    },
  },
};
