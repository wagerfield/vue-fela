var utils = require('./utils')

var isArray = utils.isArray
var isObject = utils.isObject
var reduceArray = utils.reduceArray
var reduceObject = utils.reduceObject

function mapMethod(map, method, rules, props) {
  if (isArray(map)) {

    return reduceArray(map, function reducer(result, key) {
      result[key] = method(rules[key], props)
      return result
    }, {})

  } else if (isObject(map)) {

    return reduceObject(map, function reducer(result, key, alias) {
      result[alias] = method(rules[key], props)
      return result
    }, {})

  } else {

    return reduceObject(rules, function reducer(result, rule, key) {
      result[key] = method(rule, props)
      return result
    }, {})
  }
}

function mapRule(rule, optProps) {
  return function className() {
    var props = isObject(optProps) ? optProps : this
    return this.$fela.renderRule(rule, props)
  }
}

function mapRules(rules, optMap, optProps) {
  return mapMethod(optMap, mapRule, rules, optProps)
}

function mapStyles(rules, optMap, optProps) {
  return function classNames() {
    var renderRule = this.$fela.renderRule
    var props = isObject(optProps) ? optProps : this
    return mapMethod(optMap, renderRule, rules, props)
  }
}

module.exports = {
  mapRule: mapRule,
  mapRules: mapRules,
  mapStyles: mapStyles
}
