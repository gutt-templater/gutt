function Text (text) {
  this.type = 'text';
  this.text = text;

  this.parentNode = null
  this.nextSibling = null
  this.previousSibling = null
}

module.exports = Text
