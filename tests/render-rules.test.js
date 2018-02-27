import { createRenderer } from 'fela'
import { renderRules } from '../index'
import rules from './component-rules'

const fela = createRenderer()
const props = {
  outerRadius: 0,
  innerRadius: 0,
  active: false
}

const testSnapshot = (optMap) => {
  expect(renderRules(fela, rules, props, optMap)).toMatchSnapshot()
}

describe('renderRules(renderer, rules, props, optMap)', () => {

  beforeEach(fela.clear)

  it('returns an object', () => {
    expect(renderRules(fela, rules, props)).toEqual(expect.any(Object))
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
