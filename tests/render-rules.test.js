import { createRenderer } from 'fela'
import { renderRules } from '../index'
import rules from './component-rules'

const renderer = createRenderer()
const props = {
  outerRadius: 0,
  innerRadius: 0,
  active: false
}

const testSnapshot = (optMap) => {
  expect(renderRules(renderer, rules, props, optMap)).toMatchSnapshot()
}

describe('renderRules(renderer, rules, props, optMap)', () => {

  beforeEach(renderer.clear)

  it('returns an object', () => {
    expect(renderRules(renderer, rules, props)).toEqual(expect.any(Object))
  })

  it('renders expected snapshot', () => {
    testSnapshot()
  })

  it('renders expected snapshot when optMap is an array', () => {
    testSnapshot([ 'border' ])
  })

  it('renders expected snapshot when optMap is an object', () => {
    testSnapshot({ borderAlias: 'border' })
  })
})
