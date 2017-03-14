function Logic (expr, line, column) {
  this.type = 'logic'
  this.expr = expr
  this.line = line
  this.column = column
}

module.exports = Logic
