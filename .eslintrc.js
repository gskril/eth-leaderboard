module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    indent: ["error", 2],
    semi: [2, "never"],
  },
};
