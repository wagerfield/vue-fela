var install = require('./lib/install')
var helpers = require('./lib/helpers')
var dom = require('./lib/dom')

module.exports = {
  install: install,
  mapRule: helpers.mapRule,
  mapRules: helpers.mapRules,
  mapStyles: helpers.mapStyles,
  renderRule: helpers.renderRule,
  renderRules: helpers.renderRules,
  renderClientStyles: dom.renderClientStyles,
  renderServerStyles: dom.renderServerStyles
}
