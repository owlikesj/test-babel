const fs = require('fs')
const Parser = require('@babel/parser')
const template = require("@babel/template");
const generate = require("@babel/generator");
const t = require("@babel/types");

const code = fs.readFileSync('./example.js', 'utf8')
const ast = Parser.parse(code, {
    sourceType: 'module'
})

const body = ast.program.body

const exportDefaultNodeIndex = body.findIndex(item => item.type === 'ExportDefaultDeclaration')
const expoortDefaultProps = body[exportDefaultNodeIndex].declaration.properties
const viewPropNodeIndex = expoortDefaultProps.findIndex(prop => prop.key.name === 'view')
const pageCompName = expoortDefaultProps[viewPropNodeIndex].value.name

const buildNewVueLines = template.default(`
  const app = new Vue(PAGE_COMP_NAME)
  app.$mount()
`);

const newVueLinesAst = buildNewVueLines({
  PAGE_COMP_NAME: t.identifier(pageCompName),
});

body.splice(exportDefaultNodeIndex, 0, ...newVueLinesAst)
expoortDefaultProps.splice(viewPropNodeIndex, 1)
const newCode = `import Vue from 'vue'\n${generate.default(ast).code}`
fs.writeFile('./index.mp.js', newCode, function(error) {
    if (!error) { return }
    console.log(error)
})
