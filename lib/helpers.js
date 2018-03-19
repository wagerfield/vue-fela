var isArray = require('isarray')
var isObject = require('isobject')
var utils = require('./utils')

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

function getProps(props, defaultProps) {
  return isObject(props) ? props : defaultProps
}

function renderRule(renderer, rule, props) {
  return renderer.renderRule(rule, props)
}

function renderRules(renderer, rules, props, optMap) {
  return mapMethod(optMap, renderer.renderRule, rules, props)
}

function mapRule(rule, optProps) {
  return function className() {
    var props = getProps(optProps, this)
    return renderRule(this.$fela, rule, props)
  }
}

function mapRules(rules, optMap, optProps) {
  return mapMethod(optMap, mapRule, rules, optProps)
}

function mapStyles(rules, optMap, optProps) {
  return function classNames() {
    var props = getProps(optProps, this)
    return renderRules(this.$fela, rules, props, optMap)
  }
}

module.exports = {
  mapRule: mapRule,
  mapRules: mapRules,
  mapStyles: mapStyles,
  renderRule: renderRule,
  renderRules: renderRules
}
