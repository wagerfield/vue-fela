var fela = require('fela')
var utils = require('./utils')
var Provider = require('./provider')

var get = utils.get
var isArray = utils.isArray
var isObject = utils.isObject
var isString = utils.isString
var reduceArray = utils.reduceArray
var reduceObject = utils.reduceObject
var createRenderer = fela.createRenderer

function install(Vue, config) {
  var provider = get(config, 'provider', 'fela-provider')
  var renderer = get(config, 'renderer', createRenderer(config))

  if (isString(provider)) Vue.component(provider, Provider)

  Object.defineProperty(Vue.prototype, '$fela', {
    get: function getRenderer() {
      return renderer
    }
  })
}

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
  install: install,
  mapRule: mapRule,
  mapRules: mapRules,
  Provider: Provider
}
