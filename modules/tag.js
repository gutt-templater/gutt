var singleTags = ['!DOCTYPE', 'meta', 'hr']

module.exports = {
  check: function (helper, item) {
    var checked = true

    switch (item.type) {
      case 'open_tag':
        if (~singleTags.indexOf(item.value)) {
          item.type = 'single_tag'
        } else {
          helper.neste(item.value)
        }

        break
      case 'close_tag':
        helper.closeNeste(item.value)

        break
      case 'single_tag':
        if (!~singleTags.indexOf(item.value)) {
          item.type = 'open_tag'
        }

        break
      case 'comment':
        // do nothing just catch this case

        break
      default:
        checked = false
    }

    return checked
  }
}
