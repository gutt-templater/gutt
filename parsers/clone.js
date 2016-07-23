var cachedCopyElements = {
}

function copyChildElements (node) {
  cachedCopyElements.origin = []
  cachedCopyElements.copy = []

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
    if (~cachedCopyElements.origin.indexOf(obj)) {
      return cachedCopyElements.copy[cachedCopyElements.origin.indexOf(obj)]
    }

    copy = []

    cachedCopyElements.copy.push(copy)
    cachedCopyElements.origin.push(obj)

    for (i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }

    return copy
  }

  // Handle Object
  if (obj instanceof Object) {

    if (~cachedCopyElements.origin.indexOf(obj)) {
      return cachedCopyElements.copy[cachedCopyElements.origin.indexOf(obj)]
    }

    copy = {}

    cachedCopyElements.copy.push(copy)
    cachedCopyElements.origin.push(obj)

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
