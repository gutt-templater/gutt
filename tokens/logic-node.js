function LogicNode (expr, line, column) {
  this.type = 'logic-node'
  this.expr = expr
  this.line = line
  this.column = column
}

module.exports = LogicNode
