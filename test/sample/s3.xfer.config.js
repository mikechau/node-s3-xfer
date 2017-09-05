var path = require('path');

module.exports = [
  {
    "name": "General Assets",
    "glob": {
      "nodir": true,
      "allowEmpty": true,
      "ignore": [
        "**/*.html",
        "**/asset-manifest.json",
        "**/favicon.ico",
        "**/manifest.json",
        "**/service-worker.js"
      ]
    },
    "path": path.join(__dirname, "build"),
    "matcher": "**/*"
  },
  {
    "name": "Fixed Assets",
    "glob": {
      "nodir": true,
      "allowEmpty": true
    },
    "path": path.join(__dirname, "build"),
    "matcher": "{asset-manifest.json,favicon.ico,manifest.json,service-worker.js}"
  },
  {
    "name": "HTML",
    "glob": {
      "nodir": true,
      "allowEmpty": true
    },
    "path": path.join(__dirname, "build"),
    "matcher": "**/*.html"
  }
];
