var utils = require('./utils')

var isArray = utils.isArray
var isObject = utils.isObject
var reduceArray = utils.reduceArray
var reduceObject = utils.reduceObject

function mapRule(rule, optProps) {
  return function className() {
    var props = isObject(optProps) ? optProps : this
    return this.$fela.renderRule(rule, props)
  }
}

function mapRules(rules, optMap, optProps) {
  if (isArray(optMap)) {

    return reduceArray(optMap, function reducer(result, key) {
      result[key] = mapRule(rules[key], optProps)
      return result
    }, {})

  } else if (isObject(optMap)) {

    return reduceObject(optMap, function reducer(result, key, alias) {
      result[alias] = mapRule(rules[key], optProps)
      return result
    }, {})

  } else {

    return reduceObject(rules, function reducer(result, rule, key) {
      result[key] = mapRule(rule, optProps)
      return result
    }, {})
  }
}

module.exports = {
  mapRule: mapRule,
  mapRules: mapRules
}
