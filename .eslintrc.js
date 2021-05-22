module.exports = {
  "parser": "babel-eslint",
  "extends": ["eslint:recommended", "plugin:prettier/recommended"],
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "import"
  ],
  "env": {
    "es6": true,
    "node": true
  },
  "rules": {
    "max-len": [
      "warn",
      {
        "code": 80,
        "tabWidth": 2,
        "comments": 80,
        "ignoreComments": false,
        "ignoreTrailingComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ],
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }
}