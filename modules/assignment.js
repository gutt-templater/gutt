module.exports = {
  check: function (tree, item) {
    if (item.type === 'logic' && item.value.type === 'assign') {
      item.type = 'assign'
      item.expr = item.value.expr
      item.value = item.value.value

      tree.push(item)
    }
  }
}
