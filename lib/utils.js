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

module.exports = {
  mapArray: mapArray,
  reduceArray: reduceArray,
  reduceObject: reduceObject
}
