import {
  mapArray,
  reduceArray,
  reduceObject
} from '../lib/utils'

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
