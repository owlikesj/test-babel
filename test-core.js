const babel = require("@babel/core");

const {code} = babel.transformFileSync(
  './example.js'
);

console.log(code)
