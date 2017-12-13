import {
  get,
  isArray,
  isObject,
  isString,
  isDefined,
  mapArray,
  reduceArray,
  reduceObject
} from '../utils'

describe('isArray', () => {

  it('returns true for arrays', () => {
    expect(isArray([])).toBe(true)
  })

  it('returns false for objects', () => {
    expect(isArray({})).toBe(false)
  })

  it('returns false for numbers', () => {
    expect(isArray(0)).toBe(false)
    expect(isArray(1)).toBe(false)
  })

  it('returns false for strings', () => {
    expect(isArray('foo')).toBe(false)
    expect(isArray('')).toBe(false)
  })

  it('returns false for nil values', () => {
    expect(isArray(false)).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray()).toBe(false)
  })
})

describe('isObject', () => {

  it('returns true for arrays', () => {
    expect(isObject([])).toBe(true)
  })

  it('returns true for objects', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false for numbers', () => {
    expect(isObject(0)).toBe(false)
    expect(isObject(1)).toBe(false)
  })

  it('returns false for strings', () => {
    expect(isObject('foo')).toBe(false)
    expect(isObject('')).toBe(false)
  })

  it('returns false for nil values', () => {
    expect(isObject(false)).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject()).toBe(false)
  })
})

describe('isString', () => {

  it('returns true for strings', () => {
    expect(isString('')).toBe(true)
    expect(isString('foo')).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isString([])).toBe(false)
  })

  it('returns false for objects', () => {
    expect(isString({})).toBe(false)
  })

  it('returns false for numbers', () => {
    expect(isString(0)).toBe(false)
    expect(isString(1)).toBe(false)
  })

  it('returns false for nil values', () => {
    expect(isString(false)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString()).toBe(false)
  })
})

describe('isDefined', () => {

  it('returns true for strings', () => {
    expect(isDefined('')).toBe(true)
    expect(isDefined('foo')).toBe(true)
  })

  it('returns true for arrays', () => {
    expect(isDefined([])).toBe(true)
  })

  it('returns true for objects', () => {
    expect(isDefined({})).toBe(true)
  })

  it('returns true for numbers', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined(1)).toBe(true)
  })

  it('returns true for booleans', () => {
    expect(isDefined(true)).toBe(true)
    expect(isDefined(false)).toBe(true)
  })

  it('returns true for null', () => {
    expect(isDefined(null)).toBe(true)
  })

  it('returns false for undefined', () => {
    expect(isDefined()).toBe(false)
  })
})

describe('mapArray', () => {

  it('calls iteratee with each value in an array', () => {
    const array = [ 1, 2, 3 ]
    const iteratee = jest.fn((value) => value * 2)
    const result = mapArray(array, iteratee)
    expect(iteratee).toHaveBeenCalledTimes(array.length)
    expect(iteratee.mock.calls[0]).toEqual([ 1, 0 ])
    expect(iteratee.mock.calls[1]).toEqual([ 2, 1 ])
    expect(iteratee.mock.calls[2]).toEqual([ 3, 2 ])
    expect(result.length).toBe(array.length)
    expect(result).toEqual([ 2, 4, 6 ])
  })
})

describe('reduceArray', () => {

  it('calls iteratee with each value in an array', () => {
    const array = [ 1, 2, 3 ]
    const iteratee = jest.fn((total) => total)
    const result = reduceArray(array, iteratee, 0)
    expect(iteratee).toHaveBeenCalledTimes(array.length)
    expect(iteratee.mock.calls[0]).toEqual([ 0, 1, 0 ])
    expect(iteratee.mock.calls[1]).toEqual([ 0, 2, 1 ])
    expect(iteratee.mock.calls[2]).toEqual([ 0, 3, 2 ])
    expect(result).toBe(0)
  })

  it('uses accumulator as the starting value', () => {
    const array = [ 1 ]
    const iteratee = jest.fn((total) => total)
    const result = reduceArray(array, iteratee, 10)
    expect(iteratee).toHaveBeenCalledTimes(array.length)
    expect(iteratee.mock.calls[0]).toEqual([ 10, 1, 0 ])
    expect(result).toBe(10)
  })
})

describe('reduceObject', () => {

  it('calls iteratee with each value in an object', () => {
    const object = { one: 1, two: 2 }
    const keys = Object.keys(object)
    const iteratee = jest.fn((total) => total)
    const result = reduceObject(object, iteratee, 0)
    expect(iteratee).toHaveBeenCalledTimes(keys.length)
    expect(iteratee.mock.calls[0]).toEqual([ 0, 1, 'one' ])
    expect(iteratee.mock.calls[1]).toEqual([ 0, 2, 'two' ])
    expect(result).toBe(0)
  })

  it('uses accumulator as the starting value', () => {
    const object = { one: 1 }
    const keys = Object.keys(object)
    const iteratee = jest.fn((total) => total)
    const result = reduceObject(object, iteratee, 10)
    expect(iteratee).toHaveBeenCalledTimes(keys.length)
    expect(iteratee.mock.calls[0]).toEqual([ 10, 1, 'one' ])
    expect(result).toBe(10)
  })
})

describe('get', () => {

  it('returns default value if object is undefined', () => {
    expect(get(undefined, 'foo', 1)).toBe(1)
  })

  it('returns default value if object is null', () => {
    expect(get(null, 'foo', 1)).toBe(1)
  })

  it('returns default value if object key value is undefined', () => {
    expect(get({}, 'foo', 1)).toBe(1)
  })

  it('returns object key value when defined', () => {
    expect(get({ foo: false }, 'foo', 1)).toBe(false)
    expect(get({ bar: null }, 'bar', 1)).toBe(null)
  })
})
