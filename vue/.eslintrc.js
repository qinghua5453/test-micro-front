module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": [0, {
      // 允许声明未使用变量
      "vars": "local",
      // 参数不检查
      "args": "none"
    }],
    "no-unreachable": 0,
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'indent': 0,
    'eol-last': 0,
    'no-tabs': 0,
    "no-mixed-spaces-and-tabs": 0,
    'no-useless-escape': 0,
    'no-undef': 0,
    'no-irregular-whitespace': 'off',
    'no-redeclare': 0,
    'prettier/prettier': 0,
    'vue/return-in-computed-property': 0,
    'vue/valid-v-if': 0,
    'vue/no-use-v-if-with-v-for': 0
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
