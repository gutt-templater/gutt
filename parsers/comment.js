function Comment (value) {
  this.type = 'comment'
  this.value = value

  this.parentNode = null
  this.nextNode = null
  this.prevNode = null
}

module.exports = Comment
