var singleTags = ['!DOCTYPE', 'meta', 'hr']

module.exports = {
  check: function (helper, item) {
    switch (item.type) {
      case 'open_tag':
        if (~singleTags.indexOf(item.value)) {
          item.type = 'single_tag'

          helper.push(item)
        } else {
          helper.neste(item)
        }

        break
      case 'close_tag':
        helper.closeNeste(item)

        break
      case 'single_tag':
        if (!~singleTags.indexOf(item.value)) {
          item.type = 'open_tag'

          helper.push(item)
        } else {
          helper.push(item)
        }

        break
      case 'comment':
        helper.push(item)

        break
    }
  }
}
