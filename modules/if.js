module.exports = {
  check: function (helper, item) {
    if (helper.logicMatch(item, 'type[logic].type[expr].type[func].type[var].if')) {
      item.type = 'if'
      item.value = item.value.value.attrs[0]
      helper.neste('if')

      return true
    }

    if (helper.logicMatch(item, 'type[logic].type[expr].type[func].type[var].elseif')) {
      item.type = 'elseif'
      item.value = item.value.value.attrs[0]
      helper.closeNeste('if')
      helper.neste('if')

      return true
    }

    if (helper.logicMatch(item, 'type[logic].type[expr].type[var].else')) {
      item.type = 'else'
      item.value = item.value
      helper.closeNeste('if')
      helper.neste('if')

      return true
    }

    if (helper.logicMatch(item, 'type[logic].type[expr].type[var].endif')) {
      item.type = 'endif'
      helper.closeNeste('if')

      return true
    }
  }
}
