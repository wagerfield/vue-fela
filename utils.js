var isServer = typeof window === 'undefined'
var isClient = !isServer

function toString(value) {
  return Object.prototype.toString.call(value)
}

function isType(value, type) {
  return toString(value) === type
}

function isArray(value) {
  return isType(value, '[object Array]')
}

function isObject(value) {
  return isType(value, '[object Object]')
}

function isString(value) {
  return isType(value, '[object String]')
}

function isUndefined(value) {
  return isType(value, '[object Undefined]')
}

function isDefined(value) {
  return !isUndefined(value)
}

function mapArray(array, iteratee) {
  var i, l = array.length, result = []
  for (i = 0; i < l; ++i) {
    result.push(iteratee(array[i], i))
  }
  return result
}

function reduceArray(array, iteratee, accumulator) {
  var i, l = array.length, result = accumulator
  for (i = 0; i < l; ++i) {
    result = iteratee(result, array[i], i)
  }
  return result
}

function reduceObject(object, iteratee, accumulator) {
  var key, result = accumulator
  for (key in object) {
    result = iteratee(result, object[key], key)
  }
  return result
}

function get(object, key, defaultValue) {
  return isObject(object) && isDefined(object[key]) ? object[key] : defaultValue
}

module.exports = {
  isArray: isArray,
  isObject: isObject,
  isString: isString,
  isDefined: isDefined,
  isClient: isClient,
  isServer: isServer,
  mapArray: mapArray,
  reduceArray: reduceArray,
  reduceObject: reduceObject,
  get: get
}
