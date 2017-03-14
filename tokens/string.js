function Str (value, line, column) {
  this.type = 'string'
  this.value = value
  this.line = line
  this.column = column
}

module.exports = Str
