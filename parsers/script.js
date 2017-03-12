function Script (text, line, column) {
  this.type = 'script'
  this.attrs = text.substr(8, text.indexOf('>') - 8)
  this.text = text.match(/>((.|\n|\s|\t)*?)<\/\s*script/i)[1]
  this.line = line
  this.column = column
}

module.exports = Script
