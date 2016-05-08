module.exports = {
  check: function (helper, item) {
    if (helper.logicMatch(item, 'type[logic].type[expr].type[func].type[var].for')) {
      item.type = 'for'
      item.value = item.value.value.attrs
      helper.neste('for')

      return true
    } else if (helper.logicMatch(item, 'type[logic].type[expr].type[var].endfor')) {
      helper.closeNeste('for')

      return true
    }
  }
}
