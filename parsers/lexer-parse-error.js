module.exports = function parseError (str, hash) {
  hash.column = this.yylloc.last_column
  str = 'Unexpected token'

  if (this.yy.parser) {
    this.yy.parser.parseError(str, hash)
  } else {
    throw new Error(str)
  }
}
