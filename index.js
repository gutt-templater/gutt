module.exports = require('./parsers/parser')([
  require('./modules/import'),
  require('./modules/tag'),
  require('./modules/if'),
  require('./modules/foreach'),
  require('./modules/logic'),
  require('./modules/text'),
  require('./modules/assignment')
], [
  require('./stringifiers/php'),
  require('./stringifiers/javascript')
])
