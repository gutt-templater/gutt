var cachedCopyElements = []

function copyChildElements (node) {
  cachedCopyElements = []

  return clone(node)
}

function clone (obj) {
  var copy
  var i
  var len
  var attr

  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    if (~cachedCopyElements.indexOf(obj)) {
      return obj
    }

    cachedCopyElements.push(obj)

    copy = []

    for (i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }

    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    if (~cachedCopyElements.indexOf(obj)) {
      return obj
    }

    cachedCopyElements.push(obj)

    copy = {}

    for (attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr])
      }
    }

    return copy
  }

  throw new Error('Unable to copy obj! Its type isn\'t supported.')
}

module.exports = copyChildElements
