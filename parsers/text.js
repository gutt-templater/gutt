function Text (text) {
  this.type = 'text';
  this.text = text;

  this.parentNode = null
  this.nextNode = null
  this.prevNode = null
}

module.exports = Text
