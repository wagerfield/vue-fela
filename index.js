var install = require('./lib/install')
var helpers = require('./lib/helpers')

module.exports = {
  install: install,
  mapRules: helpers.mapRules,
  mapRule: helpers.mapRule
}
