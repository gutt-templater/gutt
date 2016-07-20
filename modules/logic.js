module.exports = {
  check: function (tree, item) {
    if (item.type === 'logic' && item.value.type === 'expr') {
      item.type = 'expr'
      item.value = item.value.value

      tree.push(item)
    }
  }
}
