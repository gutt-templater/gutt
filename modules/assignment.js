module.exports = {
  check: function (helper, item) {
    if (item.type === 'logic' && item.value.type === 'assign') {
      item.type = 'assign'
      item.expr = item.value.expr
      item.value = item.value.value

      return true
    }
  }
}
