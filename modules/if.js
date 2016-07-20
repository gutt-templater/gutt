module.exports = {
  check: function (tree, item) {
    if (tree.match(item, 'type[logic].type[expr].type[func].type[var].if')) {
      item.type = 'if'
      item.value = item.value.value.attrs[0]
      tree.open(item, 'if')
    }

    if (tree.match(item, 'type[logic].type[expr].type[func].type[var].elseif')) {
      item.type = 'elseif'
      item.value = item.value.value.attrs[0]
      tree.close('if')
      tree.open(item, 'if')
    }

    if (tree.match(item, 'type[logic].type[expr].type[var].else')) {
      item.type = 'else'
      item.value = item.value
      tree.close('if')
      tree.open(item, 'if')
    }

    if (tree.match(item, 'type[logic].type[expr].type[var].endif')) {
      item.type = 'endif'
      tree.push(item)
      tree.close('if')
    }
  }
}
