function ParseError (msg, hash) {
  this.message = msg
  this.hash = hash
}

ParseError.prototype = Error

module.exports = ParseError
