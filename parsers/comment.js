function Comment (value, line, column) {
  this.type = 'comment'
  this.value = value.replace(/\\-/g, '-')
  this.line = line
  this.column = column

  this.parentNode = null
  this.nextSibling = null
  this.previousSibling = null
}

module.exports = Comment
