module.exports = {
  check: function (helper, item) {
    if (item.type === 'logic' && item.value.type === 'expr') {
      item.type = 'expr'
      item.value = item.value.value

      return true
    }
  }
}
