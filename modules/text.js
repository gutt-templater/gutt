module.exports = {
  check: function (tree, item) {
    if (item.type === 'text') {
      tree.push(item)
    }
  }
}
