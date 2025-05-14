module.exports = {
  plugins: ["stylelint-scss"],
  extends: [
    "stylelint-config-twbs-bootstrap",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "selector-max-id": 1, //TODO: nullで無制限だが・・
    "block-no-empty": null,
    "function-no-unknown": null,
    "@stylistic/value-list-comma-newline-after": null,
    "@stylistic/number-leading-zero": null,
    "@stylistic/value-list-comma-space-after": null,
    "length-zero-no-unit": null,
  },
};
