module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "@typescript-eslint"
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