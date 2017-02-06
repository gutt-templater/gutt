function Comment (value) {
  this.type = 'comment'
  this.value = value

  this.parentNode = null
  this.nextSibling = null
  this.previousSibling = null
}

module.exports = Comment
