module.exports = {
  check: function (tree, item) {
    if (tree.match(item, 'type[logic].type[expr].type[func].type[var].for')) {
      item.type = 'for'
      item.value = item.value.value.attrs
      tree.open(item, 'for')
    }

    if (tree.match(item, 'type[logic].type[expr].type[var].endfor')) {
      tree.close('for')
    }
  }
}
